from flask import Flask, request, jsonify, send_file, send_from_directory
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import os
from datetime import datetime, timedelta
import xgboost as xgb
from statsmodels.tsa.seasonal import seasonal_decompose
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__, static_folder='.')

# Define the base directory for your categories
BASE_DIR = "src/ml"

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

# Get available categories endpoint
@app.route('/categories', methods=['GET'])
def get_categories():
    categories = get_category_datasets()
    return jsonify({
        'categories': list(categories.keys()),
        'datasets': categories
    })

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
