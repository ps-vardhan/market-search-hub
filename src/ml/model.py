import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error, accuracy_score
import xgboost as xgb
from statsmodels.tsa.seasonal import seasonal_decompose
import warnings
warnings.filterwarnings('ignore')

class MarketAnalysisModel:
    def __init__(self):
        self.models = {
            'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'linear_regression': LinearRegression(),
            'lasso': Lasso(alpha=0.1),
            'ridge': Ridge(alpha=0.1),
            'xgboost': xgb.XGBRegressor(n_estimators=100, random_state=42)
        }
        self.scaler = StandardScaler()
        self.best_model = None
        self.best_model_name = None
        self.required_columns = ['sales', 'date']
        self.optional_columns = ['product', 'brand']

    def validate_data(self, df):
        """Validate the input data"""
        # Check required columns
        missing_columns = [col for col in self.required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Check data types
        if 'date' in df.columns:
            try:
                df['date'] = pd.to_datetime(df['date'])
            except:
                raise ValueError("Invalid date format in 'date' column")
        
        if 'sales' in df.columns:
            if not pd.api.types.is_numeric_dtype(df['sales']):
                raise ValueError("'sales' column must be numeric")
        
        # Check for empty or invalid data
        if df.empty:
            raise ValueError("Dataset is empty")
        
        if df['sales'].isnull().any():
            raise ValueError("Found null values in 'sales' column")
        
        return df

    def prepare_features(self, df, product_name=None, brand=None):
        """Prepare features for the model"""
        # Validate data first
        df = self.validate_data(df)
        
        if product_name:
            if brand:
                df = df[(df['product'] == product_name) & (df['brand'] == brand)]
            else:
                df = df[df['product'] == product_name]
            
            if df.empty:
                raise ValueError(f"No data found for product: {product_name}")

        # Convert date to datetime if it exists
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.month
            df['year'] = df['date'].dt.year
            df['day_of_week'] = df['date'].dt.dayofweek

        # Create lag features
        if 'sales' in df.columns:
            df['sales_lag_1'] = df['sales'].shift(1)
            df['sales_lag_7'] = df['sales'].shift(7)
            df['sales_lag_30'] = df['sales'].shift(30)

        # Create rolling mean features
        if 'sales' in df.columns:
            df['sales_rolling_mean_7'] = df['sales'].rolling(window=7).mean()
            df['sales_rolling_mean_30'] = df['sales'].rolling(window=30).mean()

        # Drop NaN values
        df = df.dropna()
        
        if df.empty:
            raise ValueError("No valid data after feature preparation")

        return df

    def train(self, df, target_column='sales'):
        """Train the model on the data"""
        try:
            # Prepare features
            df = self.prepare_features(df)
            
            # Split features and target
            X = df.drop(columns=[target_column, 'date'] if 'date' in df.columns else [target_column])
            y = df[target_column]

            # Scale features
            X_scaled = self.scaler.fit_transform(X)

            # Initialize metrics dictionary
            metrics = {}
            best_score = float('-inf')

            # Train and evaluate each model
            for name, model in self.models.items():
                # Use time series split for validation
                tscv = TimeSeriesSplit(n_splits=5)
                scores = []

                for train_idx, val_idx in tscv.split(X_scaled):
                    X_train, X_val = X_scaled[train_idx], X_scaled[val_idx]
                    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

                    model.fit(X_train, y_train)
                    y_pred = model.predict(X_val)
                    
                    # Calculate metrics
                    mae = mean_absolute_error(y_val, y_pred)
                    rmse = np.sqrt(mean_squared_error(y_val, y_pred))
                    r2 = r2_score(y_val, y_pred)
                    
                    # Calculate accuracy (as percentage of predictions within 10% of actual)
                    accuracy = np.mean(np.abs((y_pred - y_val) / y_val) <= 0.1) * 100
                    
                    scores.append({
                        'MAE': mae,
                        'RMSE': rmse,
                        'R2': r2,
                        'Accuracy': accuracy
                    })

                # Average metrics across folds
                avg_metrics = {
                    'MAE': np.mean([s['MAE'] for s in scores]),
                    'RMSE': np.mean([s['RMSE'] for s in scores]),
                    'R2': np.mean([s['R2'] for s in scores]),
                    'Accuracy': np.mean([s['Accuracy'] for s in scores])
                }
                
                metrics[name] = avg_metrics

                # Update best model
                if avg_metrics['R2'] > best_score:
                    best_score = avg_metrics['R2']
                    self.best_model = model
                    self.best_model_name = name

            return metrics
        except Exception as e:
            raise ValueError(f"Error in model training: {str(e)}")

    def predict(self, df, target_column='sales'):
        """Make predictions using the best model"""
        try:
            if not self.best_model:
                raise ValueError("Model not trained yet")
                
            # Prepare features
            df = self.prepare_features(df)
            
            # Split features
            X = df.drop(columns=[target_column, 'date'] if 'date' in df.columns else [target_column])
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make predictions
            predictions = self.best_model.predict(X_scaled)
            
            return predictions
        except Exception as e:
            raise ValueError(f"Error in prediction: {str(e)}")

    def analyze_trends(self, df, product_name=None, brand=None):
        """Analyze trends in the data"""
        try:
            if product_name:
                if brand:
                    df = df[(df['product'] == product_name) & (df['brand'] == brand)]
                else:
                    df = df[df['product'] == product_name]
                
                if df.empty:
                    return {
                        'trend_direction': 'Unknown',
                        'seasonality': 'Unknown',
                        'stability': 'Unknown',
                        'trend_strength': 0
                    }

            if 'date' not in df.columns or 'sales' not in df.columns:
                return {
                    'trend_direction': 'Unknown',
                    'seasonality': 'Unknown',
                    'stability': 'Unknown',
                    'trend_strength': 0
                }

            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')

            # Calculate seasonal decomposition
            try:
                decomposition = seasonal_decompose(df['sales'], period=12)
                trend = decomposition.trend
                seasonal = decomposition.seasonal
                residual = decomposition.resid
            except:
                return {
                    'trend_direction': 'Unknown',
                    'seasonality': 'Unknown',
                    'stability': 'Unknown',
                    'trend_strength': 0
                }

            # Calculate trend direction
            trend_direction = "Growing" if trend.iloc[-1] > trend.iloc[0] else "Declining"
            
            # Calculate seasonality strength
            seasonal_strength = np.std(seasonal) / np.std(df['sales'])
            seasonality = "Strong" if seasonal_strength > 0.3 else "Weak"

            # Calculate volatility
            volatility = np.std(residual) / np.mean(df['sales'])
            stability = "Stable" if volatility < 0.2 else "Volatile"

            return {
                'trend_direction': trend_direction,
                'seasonality': seasonality,
                'stability': stability,
                'trend_strength': float(abs(trend.iloc[-1] - trend.iloc[0]) / np.mean(df['sales']))
            }
        except Exception as e:
            return {
                'trend_direction': 'Error',
                'seasonality': 'Error',
                'stability': 'Error',
                'trend_strength': 0
            }

    def get_feature_importance(self):
        """Get feature importance from the best model"""
        if not self.best_model or not hasattr(self.best_model, 'feature_importances_'):
            return {}

        return dict(zip(self.best_model.feature_names_in_, 
                       self.best_model.feature_importances_)) 