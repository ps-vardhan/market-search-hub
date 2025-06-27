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
from .enhanced_model import EnhancedMarketAnalysisModel
warnings.filterwarnings('ignore')

class MarketAnalysisModel(EnhancedMarketAnalysisModel):
    """
    Enhanced ML Model for market analysis with market coverage prediction capabilities.
    Now inherits from EnhancedMarketAnalysisModel for comprehensive market analysis.
    """
    pass  # All functionality is inherited from EnhancedMarketAnalysisModel 