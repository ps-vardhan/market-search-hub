
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api, CategoryAnalysis, ProductAnalysis } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AnalysisProps {
  category: string;
}

const Analysis = ({ category }: AnalysisProps) => {
  const [analysis, setAnalysis] = useState<CategoryAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null);

  useEffect(() => {
    if (category) {
      setLoading(true);
      setError(null);
      
      api.analyzeCategory(category)
        .then(data => {
          setAnalysis(data);
          setLoading(false);
          toast.success(`Analysis loaded for ${category}`);
        })
        .catch(err => {
          setError('Error loading analysis');
          setLoading(false);
          toast.error(`Failed to load analysis for ${category}`);
        });
    }
  }, [category]);

  const handleProductSearch = async () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    setLoading(true);
    try {
      const result = await api.analyzeProduct(category, productName);
      setProductAnalysis(result);
      toast.success(`Analysis complete for ${productName}`);
    } catch (err) {
      toast.error('Failed to analyze product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  if (!analysis) return null;

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">{category} Analysis</h2>
      
      {/* Product Search Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Product Analysis</h3>
        <div className="flex gap-4">
          <Input
            placeholder="Enter product name..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleProductSearch} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">Analyze Product</Button>
        </div>
      </div>

      {/* Product Analysis Results */}
      {productAnalysis && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Product Analysis Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-700">Market Share</h4>
              <p className="text-2xl font-bold">{productAnalysis.marketShare}%</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700">Growth Prediction</h4>
              <p className="text-2xl font-bold">{productAnalysis.growthPrediction}%</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700">Competitor Analysis</h4>
              <p className="text-2xl font-bold">{productAnalysis.competitorPercentage}%</p>
            </div>
          </div>
          
          {/* Trend Analysis */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-indigo-600">Trend Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(productAnalysis.trends).map(([key, value]) => (
                <div key={key} className="p-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded border border-indigo-100">
                  <p className="font-medium text-indigo-700">{key}</p>
                  <p className="text-lg">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Analysis */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-indigo-600">Category Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-md border border-purple-100">
            <p className="font-medium text-indigo-600">Best Model: <span className="text-gray-800">{analysis.metrics.best_model}</span></p>
            <p className="font-medium text-indigo-600">MAE: <span className="text-gray-800">{analysis.metrics.MAE.toFixed(2)}</span></p>
            <p className="font-medium text-indigo-600">RMSE: <span className="text-gray-800">{analysis.metrics.RMSE.toFixed(2)}</span></p>
            <p className="font-medium text-indigo-600">R²: <span className="text-gray-800">{analysis.metrics.R2.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      {/* Visualization */}
      {analysis.visualization && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">Market Trends</h3>
          <div className="p-2 bg-white rounded-lg shadow-lg border border-indigo-100">
            <img 
              src={`data:image/png;base64,${analysis.visualization}`} 
              alt="Analysis Visualization"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Insights */}
      {Object.keys(analysis.insights).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.insights).map(([key, value]) => (
              <div key={key} className="p-4 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md border border-blue-100">
                <h4 className="font-semibold text-blue-700">{key}</h4>
                <p>{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
