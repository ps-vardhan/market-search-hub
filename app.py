from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import os
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

from src.ml.model import MarketAnalysisModel

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Define the base directory for your categories
BASE_DIR = "src/ml"

# Initialize the enhanced ML model
model = MarketAnalysisModel()

# Get available categories and their dataset paths
def get_category_datasets():
    categories = {}
    for category in os.listdir(BASE_DIR):
        data_dir = os.path.join(BASE_DIR, category, "data")
        if os.path.isdir(data_dir):
            for file in os.listdir(data_dir):
                if file.endswith(".csv"):
                    categories[category] = os.path.join(data_dir, file)
                    break
    return categories

def generate_predictions(df):
    """Generate predictions using the ML model"""
    try:
        # Train the model
        metrics = model.train(df)
        
        # Make predictions
        predictions = model.predict(df)
        
        # Prepare dates for predictions
        if 'date' in df.columns:
            dates = pd.date_range(start=df['date'].max(), periods=30, freq='D')
        else:
            dates = pd.date_range(start=datetime.now(), periods=30, freq='D')
        
        # Format predictions
        predictions_by_brand = {
            'overall': {
                'dates': dates,
                'values': predictions[-30:].tolist(),  # Last 30 predictions
                'model_metrics': metrics,
                'best_model': model.best_model_name
            }
        }
        
        return predictions_by_brand, df
    except Exception as e:
        raise ValueError(f"Error generating predictions: {str(e)}")

def generate_visualizations(df, dates, values, metrics):
    """Generate visualizations for the analysis"""
    try:
        plt.figure(figsize=(12, 6))
        
        # Plot actual sales
        if 'date' in df.columns and 'sales' in df.columns:
            plt.plot(pd.to_datetime(df['date']), df['sales'], label='Actual Sales', alpha=0.7)
        
        # Plot predictions
        plt.plot(dates, values, label='Predictions', linestyle='--')
        
        plt.title('Sales Trend and Predictions')
        plt.xlabel('Date')
        plt.ylabel('Sales')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        # Convert plot to base64
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        visualization = base64.b64encode(img.getvalue()).decode()
        plt.close()
        
        return visualization
    except Exception as e:
        raise ValueError(f"Error generating visualization: {str(e)}")

def analyze_product_performance(df, product_name, brand=None):
    """Analyze performance metrics for a specific product"""
    try:
        if brand:
            product_data = df[(df['product'] == product_name) & (df['brand'] == brand)]
        else:
            product_data = df[df['product'] == product_name]
        
        if product_data.empty:
            return {
                'marketShare': 0,
                'growthPrediction': 0,
                'competitorPercentage': 0,
                'trends': {
                    'trend_direction': 'Unknown',
                    'seasonality': 'Unknown',
                    'stability': 'Unknown',
                    'trend_strength': 0
                },
                'insights': {
                    'status': 'No data available for this product'
                }
            }
        
        # Calculate market share
        total_sales = df['sales'].sum()
        product_sales = product_data['sales'].sum()
        market_share = (product_sales / total_sales) * 100
        
        # Get trend analysis from ML model
        trends = model.analyze_trends(df, product_name, brand)
        
        # Calculate growth rate
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            product_data['date'] = pd.to_datetime(product_data['date'])
            
            # Calculate month-over-month growth
            monthly_sales = product_data.groupby(product_data['date'].dt.to_period('M'))['sales'].sum()
            if len(monthly_sales) > 1:
                growth_rate = ((monthly_sales.iloc[-1] - monthly_sales.iloc[-2]) / monthly_sales.iloc[-2]) * 100
            else:
                growth_rate = 0
        else:
            growth_rate = 0
        
        # Calculate competitor analysis
        if brand:
            competitors = df[df['brand'] != brand]['sales'].sum()
            competitor_percentage = (competitors / total_sales) * 100
        else:
            competitor_percentage = ((total_sales - product_sales) / total_sales) * 100
        
        # Generate insights
        insights = {
            'market_position': 'Leading' if market_share > 50 else 'Strong' if market_share > 25 else 'Moderate' if market_share > 10 else 'Weak',
            'growth_status': 'Growing' if growth_rate > 0 else 'Declining',
            'competition_level': 'High' if competitor_percentage > 70 else 'Moderate' if competitor_percentage > 40 else 'Low'
        }
        
        return {
            'marketShare': round(market_share, 2),
            'growthPrediction': round(growth_rate, 2),
            'competitorPercentage': round(competitor_percentage, 2),
            'trends': trends,
            'insights': insights
        }
    except Exception as e:
        raise ValueError(f"Error analyzing product performance: {str(e)}")

# Error handler
@app.errorhandler(Exception)
def handle_error(error):
    response = {
        'error': str(error),
        'status': 'error'
    }
    return jsonify(response), 400

# Get available categories endpoint
@app.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = get_category_datasets()
        return jsonify({
            'categories': list(categories.keys()),
            'datasets': categories
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Product analysis endpoint
@app.route('/analyze/<category>/product', methods=['POST'])
def analyze_product(category):
    try:
        categories = get_category_datasets()
        
        if category not in categories:
            return jsonify({'error': f'Category {category} not found'}), 404
        
        data = request.get_json()
        if not data or 'productName' not in data:
            return jsonify({'error': 'Product name is required'}), 400
        
        product_name = data['productName']
        dataset_path = categories[category]
        
        # Read the dataset
        df = pd.read_csv(dataset_path)
        
        # Analyze product performance
        if 'brand' in df.columns:
            # If brand is available, analyze for the specific brand-product combination
            brand = df[df['product'] == product_name]['brand'].iloc[0] if not df[df['product'] == product_name].empty else None
            if brand:
                analysis = analyze_product_performance(df, product_name, brand)
            else:
                return jsonify({'error': f'Product {product_name} not found'}), 404
        else:
            # If no brand column, analyze just the product
            analysis = analyze_product_performance(df, product_name)
        
        # Generate visualization if date is available
        if 'date' in df.columns:
            try:
                plt.figure(figsize=(10, 6))
                product_data = df[df['product'] == product_name]
                plt.plot(pd.to_datetime(product_data['date']), product_data['sales'])
                plt.title(f'Sales Trend for {product_name}')
                plt.xlabel('Date')
                plt.ylabel('Sales')
                plt.xticks(rotation=45)
                plt.tight_layout()
                
                # Convert plot to base64
                img = io.BytesIO()
                plt.savefig(img, format='png')
                img.seek(0)
                visualization = base64.b64encode(img.getvalue()).decode()
                plt.close()
                
                analysis['visualization'] = visualization
            except Exception as e:
                print(f"Warning: Could not generate visualization: {str(e)}")
        
        return jsonify(analysis)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Modified upload endpoint to handle category-specific analysis
@app.route('/analyze/<category>', methods=['POST'])
def analyze_category(category):
    categories = get_category_datasets()
    
    if category not in categories:
        return jsonify({'error': f'Category {category} not found'}), 404
    
    dataset_path = categories[category]
    
    try:
        # Read the dataset
        df = pd.read_csv(dataset_path)
        
        # Validate required columns
        required_columns = ['sales', 'date']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_columns)}'}), 400
        
        # Generate predictions
        predictions_by_brand, df = generate_predictions(df)
        
        # Calculate product performance insights
        product_insights = {}
        if 'product' in df.columns:
            if 'brand' in df.columns:
                for brand in df['brand'].unique():
                    brand_products = df[df['brand'] == brand]['product'].unique()
                    for product in brand_products:
                        product_insights[f"{brand} - {product}"] = analyze_product_performance(df, product, brand)
            else:
                for product in df['product'].unique():
                    product_insights[product] = analyze_product_performance(df, product)
        
        # Calculate distribution
        distribution = {}
        if 'brand' in df.columns:
            if 'product' in df.columns:
                for brand in df['brand'].unique():
                    brand_data = df[df['brand'] == brand]
                    distribution[brand] = brand_data.groupby('product')['sales'].sum().to_dict()
            else:
                distribution = df.groupby('brand')['sales'].sum().to_dict()
        else:
            if 'product' in df.columns:
                distribution = df.groupby('product')['sales'].sum().to_dict()
        
        # Generate visualizations
        visualization = None
        if 'date' in df.columns:
            visualization = generate_visualizations(df, 
                predictions_by_brand[list(predictions_by_brand.keys())[0]]['dates'],
                predictions_by_brand[list(predictions_by_brand.keys())[0]]['values'],
                predictions_by_brand[list(predictions_by_brand.keys())[0]]['model_metrics']
            )
        
        # Format predictions data
        formatted_predictions = {}
        for brand, data in predictions_by_brand.items():
            formatted_predictions[brand] = {
                'dates': [d.strftime('%Y-%m-%d') for d in data['dates']],
                'values': data['values'].tolist() if hasattr(data['values'], 'tolist') else data['values'],
                'model_metrics': data['model_metrics'],
                'best_model': data['best_model']
            }
        
        return jsonify({
            'category': category,
            'predictions': formatted_predictions,
            'distribution': distribution,
            'insights': product_insights,
            'visualization': visualization,
            'has_date': 'date' in df.columns,
            'has_product': 'product' in df.columns,
            'has_brand': 'brand' in df.columns,
            'metrics': {
                'best_model': predictions_by_brand[list(predictions_by_brand.keys())[0]]['best_model'],
                'MAE': predictions_by_brand[list(predictions_by_brand.keys())[0]]['model_metrics'][predictions_by_brand[list(predictions_by_brand.keys())[0]]['best_model']]['MAE'],
                'RMSE': predictions_by_brand[list(predictions_by_brand.keys())[0]]['model_metrics'][predictions_by_brand[list(predictions_by_brand.keys())[0]]['best_model']]['RMSE'],
                'R2': predictions_by_brand[list(predictions_by_brand.keys())[0]]['model_metrics'][predictions_by_brand[list(predictions_by_brand.keys())[0]]['best_model']]['R2']
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing category {category}: {str(e)}'}), 400

# Keep your existing index route
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
