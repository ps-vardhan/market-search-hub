import { useEffect, useState } from 'react';
import { api, CategoryAnalysis } from '../lib/api';

interface AnalysisProps {
  category: string;
}

const Analysis = ({ category }: AnalysisProps) => {
  const [analysis, setAnalysis] = useState<CategoryAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setLoading(true);
      setError(null);
      
      api.analyzeCategory(category)
        .then(data => {
          setAnalysis(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Error loading analysis');
          setLoading(false);
        });
    }
  }, [category]);

  if (loading) return <div>Loading analysis...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!analysis) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{category} Analysis</h2>
      
      {/* Model Metrics */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Model Performance</h3>
        <div className="grid grid-cols-2 gap-4">
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
          <h3 className="text-xl font-semibold mb-2">Visualization</h3>
          <img 
            src={`data:image/png;base64,${analysis.visualization}`} 
            alt="Analysis Visualization"
            className="w-full"
          />
        </div>
      )}

      {/* Insights */}
      {Object.keys(analysis.insights).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analysis.insights).map(([key, value]) => (
              <div key={key} className="p-4 bg-white rounded shadow">
                <h4 className="font-semibold">{key}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
