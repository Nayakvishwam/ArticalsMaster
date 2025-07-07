import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getarticleHistory } from '../apis/articles';

export default function ArticleHistory({ article, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [article.id]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getarticleHistory(article.id);
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Article History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* History List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Version History</h3>
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading history...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-8 text-red-600">
                  Error loading history: {error}
                </div>
              )}
              {!loading && !error && (
                <div className="space-y-2">
                  {/* Current Version */}
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedVersion === null ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedVersion(null)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-600">Current Version</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Historical Versions */}
                  {history?.revisions?.map((version, index) => (
                    <div
                      key={version.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedVersion === version ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Version {version?.revisionNumber}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {version.title.substring(0, 50)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {selectedVersion === null ? (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {article.title}
                  </h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {article.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedVersion.title}
                  </h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {selectedVersion.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

