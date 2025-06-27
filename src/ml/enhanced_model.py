import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import xgboost as xgb
from statsmodels.tsa.seasonal import seasonal_decompose
import warnings
from .market_coverage_model import MarketCoveragePredictor
warnings.filterwarnings('ignore')

class EnhancedMarketAnalysisModel:
    """Enhanced ML model that combines traditional analysis with market coverage prediction"""
    
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
        self.label_encoders = {}
        self.best_model = None
        self.best_model_name = None
        self.market_coverage_predictor = MarketCoveragePredictor()
        self.category = None
        
    def process_data_by_category(self, df, category):
        """Process data based on category type"""
        self.category = category.lower()
        df_processed = df.copy()
        
        try:
            if self.category == 'smartphones':
                df_processed = self._process_smartphones(df_processed)
            elif self.category == 'electronics':
                df_processed = self._process_electronics(df_processed)
            elif self.category == 'fashion':
                df_processed = self._process_fashion(df_processed)
            elif self.category == 'groceries':
                df_processed = self._process_groceries(df_processed)
            elif self.category == 'stocks':
                df_processed = self._process_stocks(df_processed)
            else:
                # Generic processing
                df_processed = self._process_generic(df_processed)
                
            return df_processed
            
        except Exception as e:
            print(f"Error processing {category} data: {str(e)}")
            return self._process_generic(df_processed)
    
    def _process_smartphones(self, df):
        """Process smartphone data"""
        # Ensure required columns exist
        if 'sales' not in df.columns:
            if 'Selling Price' in df.columns:
                # Generate sales based on price
                df['sales'] = df['Selling Price'] * np.random.uniform(1, 100, len(df))
            else:
                df['sales'] = np.random.uniform(1000, 50000, len(df))
        
        if 'date' not in df.columns:
            df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
        
        # Convert relevant columns to numeric
        for col in ['Selling Price', 'Original Price', 'Rating']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Handle categorical encoding
        categorical_cols = ['Brands', 'Models', 'Colors']
        for col in categorical_cols:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col].astype(str))
        
        return df
    
    def _process_electronics(self, df):
        """Process electronics data"""
        # Clean the data
        df = df[df['Order ID'] != 'Order ID'].copy()  # Remove header rows
        
        # Convert to numeric
        for col in ['Price Each', 'Quantity Ordered']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Calculate sales
        if 'sales' not in df.columns:
            if 'Price Each' in df.columns and 'Quantity Ordered' in df.columns:
                df['sales'] = df['Price Each'] * df['Quantity Ordered']
            else:
                df['sales'] = np.random.uniform(10, 1000, len(df))
        
        # Handle date
        if 'date' not in df.columns and 'Order Date' in df.columns:
            df['date'] = pd.to_datetime(df['Order Date'], errors='coerce')
        elif 'date' not in df.columns:
            df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='H')
        
        # Encode product names
        if 'Product' in df.columns:
            if 'Product' not in self.label_encoders:
                self.label_encoders['Product'] = LabelEncoder()
            df['Product_encoded'] = self.label_encoders['Product'].fit_transform(df['Product'].astype(str))
        
        return df
    
    def _process_fashion(self, df):
        """Process fashion data"""
        if 'sales' not in df.columns:
            df['sales'] = np.random.uniform(100, 5000, len(df))
        
        if 'date' not in df.columns:
            df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
        
        return df
    
    def _process_groceries(self, df):
        """Process groceries data"""
        # Handle column name variations
        if 'sales' not in df.columns and 'Sales' in df.columns:
            df['sales'] = pd.to_numeric(df['Sales'], errors='coerce')
        elif 'sales' not in df.columns:
            df['sales'] = np.random.uniform(50, 1000, len(df))
        
        if 'date' not in df.columns and 'Order_Date' in df.columns:
            df['date'] = pd.to_datetime(df['Order_Date'], errors='coerce')
        elif 'date' not in df.columns:
            df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
        
        # Encode categorical variables
        categorical_cols = ['Category', 'Region', 'Customer_Segment']
        for col in categorical_cols:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col].astype(str))
        
        return df
    
    def _process_stocks(self, df):
        """Process stocks data"""
        if 'sales' not in df.columns:
            # For stocks, use market cap or trading volume as 'sales'
            df['sales'] = np.random.uniform(1000000, 1000000000, len(df))
        
        if 'date' not in df.columns:
            df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
        
        # Encode categorical variables
        categorical_cols = ['Symbol', 'Security Name', 'Market Category']
        for col in categorical_cols:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df[col].astype(str))
        
        return df
    
    def _process_generic(self, df):
        """Generic data processing"""
        if 'sales' not in df.columns:
            df['sales'] = np.random.uniform(100, 10000, len(df))
        
        if 'date' not in df.columns:
            df['date'] = pd.date_range(start='2020-01-01', periods=len(df), freq='D')
        
        return df
    
    def train(self, df, category='general'):
        """Train the enhanced model"""
        try:
            # Process data based on category
            df_processed = self.process_data_by_category(df, category)
            
            # Train market coverage predictor
            market_coverage_metrics = self.market_coverage_predictor.train_market_coverage_model(df_processed, category)
            
            # Prepare features for traditional analysis
            df_processed = self._prepare_features(df_processed)
            
            # Select features for traditional model
            feature_columns = self._select_features(df_processed)
            
            if not feature_columns:
                raise ValueError("No suitable features found for training")
            
            X = df_processed[feature_columns].fillna(0)
            y = df_processed['sales']
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train traditional models
            traditional_metrics = self._train_traditional_models(X_scaled, y)
            
            # Combine metrics
            combined_metrics = {
                'traditional_models': traditional_metrics,
                'market_coverage_model': market_coverage_metrics
            }
            
            return combined_metrics
            
        except Exception as e:
            raise ValueError(f"Error in enhanced model training: {str(e)}")
    
    def _prepare_features(self, df):
        """Prepare features for traditional analysis"""
        # Convert date to datetime if it exists
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            df = df.dropna(subset=['date'])
            df['month'] = df['date'].dt.month
            df['year'] = df['date'].dt.year
            df['day_of_week'] = df['date'].dt.dayofweek
            df['quarter'] = df['date'].dt.quarter

        # Create lag features if we have enough data
        if len(df) > 30 and 'sales' in df.columns:
            df = df.sort_values('date')
            df['sales_lag_1'] = df['sales'].shift(1)
            df['sales_lag_7'] = df['sales'].shift(7)
            df['sales_rolling_mean_7'] = df['sales'].rolling(window=7, min_periods=1).mean()
            df['sales_rolling_mean_30'] = df['sales'].rolling(window=30, min_periods=1).mean()

        return df
    
    def _select_features(self, df):
        """Select appropriate features for training"""
        # Prefer encoded categorical features and time features
        feature_columns = []
        
        # Add encoded categorical features
        encoded_cols = [col for col in df.columns if col.endswith('_encoded')]
        feature_columns.extend(encoded_cols)
        
        # Add time features
        time_cols = ['month', 'year', 'day_of_week', 'quarter']
        feature_columns.extend([col for col in time_cols if col in df.columns])
        
        # Add lag features
        lag_cols = ['sales_lag_1', 'sales_lag_7', 'sales_rolling_mean_7', 'sales_rolling_mean_30']
        feature_columns.extend([col for col in lag_cols if col in df.columns])
        
        # Add other numeric features
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        other_numeric = [col for col in numeric_cols if col not in feature_columns and col not in ['sales', 'date']]
        feature_columns.extend(other_numeric[:5])  # Limit to top 5 to avoid overfitting
        
        # Remove any columns with all missing values
        feature_columns = [col for col in feature_columns if col in df.columns and not df[col].isna().all()]
        
        return feature_columns
    
    def _train_traditional_models(self, X, y):
        """Train traditional ML models"""
        best_score = float('-inf')
        metrics = {}
        
        # Use TimeSeriesSplit for time-based data
        tscv = TimeSeriesSplit(n_splits=min(5, len(X)//10))
        
        for name, model in self.models.items():
            try:
                scores = []
                
                for train_idx, val_idx in tscv.split(X):
                    X_train, X_val = X[train_idx], X[val_idx]
                    y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

                    model.fit(X_train, y_train)
                    y_pred = model.predict(X_val)
                    
                    # Calculate metrics
                    mae = mean_absolute_error(y_val, y_pred)
                    rmse = np.sqrt(mean_squared_error(y_val, y_pred))
                    r2 = r2_score(y_val, y_pred)
                    
                    scores.append({'MAE': mae, 'RMSE': rmse, 'R2': r2})

                # Average metrics across folds
                avg_metrics = {
                    'MAE': np.mean([s['MAE'] for s in scores]),
                    'RMSE': np.mean([s['RMSE'] for s in scores]),
                    'R2': np.mean([s['R2'] for s in scores])
                }
                
                metrics[name] = avg_metrics

                # Update best model
                if avg_metrics['R2'] > best_score:
                    best_score = avg_metrics['R2']
                    self.best_model = model
                    self.best_model_name = name
                    
            except Exception as e:
                print(f"Error training {name}: {str(e)}")
                continue

        return metrics
    
    def predict(self, df):
        """Make predictions using the best traditional model"""
        try:
            if self.best_model is None:
                raise ValueError("Model not trained yet")
                
            # Process data
            df_processed = self.process_data_by_category(df, self.category or 'general')
            df_processed = self._prepare_features(df_processed)
            
            # Use the same features as training
            feature_columns = self._select_features(df_processed)
            X = df_processed[feature_columns].fillna(0)
            
            # Scale features
            X_scaled = self.scaler.transform(X)
            
            # Make predictions
            predictions = self.best_model.predict(X_scaled)
            
            return predictions
            
        except Exception as e:
            raise ValueError(f"Error in prediction: {str(e)}")
    
    def predict_market_coverage(self, df, product_name=None, brand=None):
        """Predict market coverage using the specialized model"""
        return self.market_coverage_predictor.predict_market_coverage(
            df, self.category or 'general', product_name, brand
        )
    
    def analyze_market_coverage_factors(self, df):
        """Analyze factors affecting market coverage"""
        return self.market_coverage_predictor.analyze_market_coverage_factors(
            df, self.category or 'general'
        )
    
    def analyze_trends(self, df, product_name=None, brand=None):
        """Enhanced trend analysis"""
        try:
            # Filter data if specific product/brand requested
            df_filtered = df.copy()
            
            if product_name:
                product_columns = ['Product', 'Mobile', 'product', 'Models']
                product_col = None
                for col in product_columns:
                    if col in df_filtered.columns:
                        product_col = col
                        break
                
                if product_col:
                    df_filtered = df_filtered[df_filtered[product_col].str.contains(product_name, case=False, na=False)]
            
            if brand:
                brand_columns = ['Brand', 'Brands', 'brand']
                brand_col = None
                for col in brand_columns:
                    if col in df_filtered.columns:
                        brand_col = col
                        break
                
                if brand_col:
                    df_filtered = df_filtered[df_filtered[brand_col].str.contains(brand, case=False, na=False)]
            
            if df_filtered.empty:
                return {
                    'trend_direction': 'Unknown',
                    'seasonality': 'Unknown',
                    'stability': 'Unknown',
                    'trend_strength': 0,
                    'market_coverage_trend': 'Unknown'
                }

            # Process data
            df_processed = self.process_data_by_category(df_filtered, self.category or 'general')
            
            # Basic trend analysis
            if 'date' not in df_processed.columns or 'sales' not in df_processed.columns:
                return {
                    'trend_direction': 'Unknown',
                    'seasonality': 'Unknown', 
                    'stability': 'Unknown',
                    'trend_strength': 0,
                    'market_coverage_trend': 'Unknown'
                }

            df_processed['date'] = pd.to_datetime(df_processed['date'], errors='coerce')
            df_processed = df_processed.dropna(subset=['date', 'sales'])
            df_processed = df_processed.sort_values('date')

            if len(df_processed) < 12:
                # Simple trend for small datasets
                if len(df_processed) >= 2:
                    trend_direction = "Growing" if df_processed['sales'].iloc[-1] > df_processed['sales'].iloc[0] else "Declining"
                    trend_strength = abs(df_processed['sales'].iloc[-1] - df_processed['sales'].iloc[0]) / df_processed['sales'].mean()
                else:
                    trend_direction = "Stable"
                    trend_strength = 0
                
                return {
                    'trend_direction': trend_direction,
                    'seasonality': 'Insufficient data',
                    'stability': 'Unknown',
                    'trend_strength': float(trend_strength),
                    'market_coverage_trend': trend_direction
                }

            # Seasonal decomposition for larger datasets
            try:
                # Resample to monthly data
                monthly_data = df_processed.set_index('date')['sales'].resample('M').sum()
                
                if len(monthly_data) >= 12:
                    decomposition = seasonal_decompose(monthly_data, period=12, extrapolate_trend='freq')
                    trend = decomposition.trend
                    seasonal = decomposition.seasonal
                    
                    # Calculate metrics
                    trend_direction = "Growing" if trend.iloc[-1] > trend.iloc[0] else "Declining"
                    seasonal_strength = np.std(seasonal) / np.std(monthly_data)
                    seasonality = "Strong" if seasonal_strength > 0.3 else "Moderate" if seasonal_strength > 0.1 else "Weak"
                    
                    # Volatility
                    volatility = np.std(monthly_data) / np.mean(monthly_data)
                    stability = "Stable" if volatility < 0.2 else "Moderate" if volatility < 0.5 else "Volatile"
                    
                    trend_strength = abs(trend.iloc[-1] - trend.iloc[0]) / np.mean(monthly_data)
                    
                else:
                    trend_direction = "Growing" if monthly_data.iloc[-1] > monthly_data.iloc[0] else "Declining"
                    seasonality = "Insufficient data"
                    stability = "Unknown"
                    trend_strength = abs(monthly_data.iloc[-1] - monthly_data.iloc[0]) / monthly_data.mean()
                
            except Exception as e:
                print(f"Error in seasonal decomposition: {str(e)}")
                trend_direction = "Growing" if df_processed['sales'].iloc[-1] > df_processed['sales'].iloc[0] else "Declining"
                seasonality = "Unknown"
                stability = "Unknown"
                trend_strength = abs(df_processed['sales'].iloc[-1] - df_processed['sales'].iloc[0]) / df_processed['sales'].mean()

            return {
                'trend_direction': trend_direction,
                'seasonality': seasonality,
                'stability': stability,
                'trend_strength': float(trend_strength),
                'market_coverage_trend': trend_direction
            }
            
        except Exception as e:
            return {
                'trend_direction': 'Error',
                'seasonality': 'Error',
                'stability': 'Error',
                'trend_strength': 0,
                'market_coverage_trend': 'Error',
                'error': str(e)
            }