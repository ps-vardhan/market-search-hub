
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
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">{category} Analysis</h2>
      
      {/* Product Search Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Product Analysis</h3>
        <div className="flex gap-4">
          <Input
            placeholder="Enter product name..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleProductSearch}>Analyze Product</Button>
        </div>
      </div>

      {/* Product Analysis Results */}
      {productAnalysis && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Product Analysis Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-700">Market Share</h4>
              <p className="text-2xl font-bold">{productAnalysis.marketShare}%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">Growth Prediction</h4>
              <p className="text-2xl font-bold">{productAnalysis.growthPrediction}%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">Competitor Analysis</h4>
              <p className="text-2xl font-bold">{productAnalysis.competitorPercentage}%</p>
            </div>
          </div>
          
          {/* Trend Analysis */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Trend Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(productAnalysis.trends).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">{key}</p>
                  <p className="text-lg">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Analysis */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Category Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <p>Best Model: {analysis.metrics.best_model}</p>
            <p>MAE: {analysis.metrics.MAE.toFixed(2)}</p>
            <p>RMSE: {analysis.metrics.RMSE.toFixed(2)}</p>
            <p>R²: {analysis.metrics.R2.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Visualization */}
      {analysis.visualization && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
          <img 
            src={`data:image/png;base64,${analysis.visualization}`} 
            alt="Analysis Visualization"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Insights */}
      {Object.keys(analysis.insights).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.insights).map(([key, value]) => (
              <div key={key} className="p-4 bg-white rounded shadow">
                <h4 className="font-semibold">{key}</h4>
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
