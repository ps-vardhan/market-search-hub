const API_BASE_URL = 'http://localhost:5000';

export interface CategoryAnalysis {
  category: string;
  predictions: {
    [key: string]: {
      dates: string[];
      values: number[];
      model_metrics: {
        [key: string]: {
          MAE: number;
          RMSE: number;
          R2: number;
          Accuracy: number;
        };
      };
      best_model: string;
    };
  };
  distribution: {
    [key: string]: number | { [key: string]: number };
  };
  insights: {
    [key: string]: string;
  };
  visualization: string;
  has_date: boolean;
  has_product: boolean;
  has_brand: boolean;
  metrics: {
    best_model: string;
    MAE: number;
    RMSE: number;
    R2: number;
  };
}

export const api = {
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  async analyzeCategory(category: string): Promise<CategoryAnalysis> {
    const response = await fetch(`${API_BASE_URL}/analyze/${category}`);
    return response.json();
  }
};
