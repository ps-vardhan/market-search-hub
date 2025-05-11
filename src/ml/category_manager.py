import os
import pandas as pd
from .model import MarketAnalysisModel

class CategoryManager:
    def __init__(self):
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        self.categories = {
            'stocks': {
                'path': os.path.join(self.base_path, 'Stocks/data/stocks.csv'),
                'model': MarketAnalysisModel(),
                'description': 'Stock market analysis'
            },
            'smartphones': {
                'path': os.path.join(self.base_path, 'Smartphones/data/phones.csv'),
                'model': MarketAnalysisModel(),
                'description': 'Smartphone market analysis'
            },
            'fashion': {
                'path': os.path.join(self.base_path, 'Fashion/data/fashionsales.csv'),
                'model': MarketAnalysisModel(),
                'description': 'Fashion market analysis'
            },
            'groceries': {
                'path': os.path.join(self.base_path, 'Groceries/data/grocerysales.csv'),
                'model': MarketAnalysisModel(),
                'description': 'Grocery market analysis'
            },
            'electronics': {
                'path': os.path.join(self.base_path, 'Electronics/data/sales.csv'),
                'model': MarketAnalysisModel(),
                'description': 'Electronics market analysis'
            }
        }
        self._load_all_data()

    def _load_all_data(self):
        """Load all category data and train models"""
        for category, info in self.categories.items():
            try:
                # Load data
                df = pd.read_csv(info['path'])
                
                # Train model
                metrics = info['model'].train(df)
                
                # Store data and metrics
                self.categories[category]['data'] = df
                self.categories[category]['metrics'] = metrics
                
            except Exception as e:
                print(f"Error loading {category} data: {str(e)}")
                self.categories[category]['data'] = None
                self.categories[category]['metrics'] = None

    def get_category_data(self, category):
        """Get data for a specific category"""
        if category not in self.categories:
            raise ValueError(f"Category {category} not found")
        return self.categories[category]['data']

    def get_category_model(self, category):
        """Get model for a specific category"""
        if category not in self.categories:
            raise ValueError(f"Category {category} not found")
        return self.categories[category]['model']

    def get_category_metrics(self, category):
        """Get metrics for a specific category"""
        if category not in self.categories:
            raise ValueError(f"Category {category} not found")
        return self.categories[category]['metrics']

    def analyze_category(self, category, product_name=None, brand=None):
        """Analyze a specific category"""
        if category not in self.categories:
            raise ValueError(f"Category {category} not found")
        
        model = self.categories[category]['model']
        data = self.categories[category]['data']
        
        if data is None:
            raise ValueError(f"No data available for category {category}")
        
        return model.analyze_trends(data, product_name, brand)

    def predict_category(self, category, data):
        """Make predictions for a specific category"""
        if category not in self.categories:
            raise ValueError(f"Category {category} not found")
        
        model = self.categories[category]['model']
        return model.predict(data)

    def get_available_categories(self):
        """Get list of available categories"""
        return list(self.categories.keys())

    def get_category_description(self, category):
        """Get description for a specific category"""
        if category not in self.categories:
            raise ValueError(f"Category {category} not found")
        return self.categories[category]['description'] 