import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';

const InventoryHistory = ({ product, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product && isOpen) {
      fetchHistory();
    }
  }, [product, isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await inventoryAPI.getHistory(product.id);
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError(error.response?.data?.error || 'Failed to fetch inventory history');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-4 py-6 sm:px-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Inventory History
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {product?.name} - {history.length} changes
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-2">Error loading history</div>
                  <p className="text-gray-500 text-sm">{error}</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No inventory history found.</p>
                </div>
              ) : (
                <div className="px-4 py-4">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {history.map((log, index) => (
                        <li key={log.id}>
                          <div className="relative pb-8">
                            {index !== history.length - 1 && (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    log.change_type === 'INCREASE' 
                                      ? 'bg-green-500' 
                                      : log.change_type === 'DECREASE'
                                      ? 'bg-red-500'
                                      : 'bg-gray-500'
                                  }`}
                                >
                                  {log.change_type === 'INCREASE' ? (
                                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : log.change_type === 'DECREASE' ? (
                                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">
                                      {log.description}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500">
                                    By {log.changed_by} • {log.formatted_timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;