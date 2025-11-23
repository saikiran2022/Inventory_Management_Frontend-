import { useState, useEffect } from 'react';
import { productsAPI, testConnection } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionTested, setConnectionTested] = useState(false);

  // Test backend connection on component mount
  useEffect(() => {
    const testBackendConnection = async () => {
      console.log('🧪 Testing backend connection...');
      const isConnected = await testConnection();
      setConnectionTested(true);
      
      if (isConnected) {
        console.log('✅ Backend connection successful, fetching products...');
        fetchProducts();
      } else {
        setError('Cannot connect to backend server. Please make sure the backend is running on port 5000.');
      }
    };

    testBackendConnection();
  }, []);

  const fetchProducts = async (params = {}) => {
    if (!connectionTested) {
      console.log('⏳ Waiting for connection test...');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('📦 Fetching products...');
      const response = await productsAPI.getAll(params);
      console.log(`✅ Successfully fetched ${response.data.length} products`);
      setProducts(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch products';
      console.error('❌ Error fetching products:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced createProduct with detailed logging
  const createProduct = async (data) => {
    console.log('🚀 Creating new product with data:', data);
    try {
      const response = await productsAPI.create(data);
      console.log('✅ Product created successfully:', response.data);
      setProducts(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create product';
      console.error('❌ Error creating product:', {
        error: err,
        response: err.response,
        message: errorMessage
      });
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await productsAPI.update(id, data);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...response.data } : p));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update product';
      return { success: false, error: errorMessage };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete product';
      return { success: false, error: errorMessage };
    }
  };

  return {
    products,
    loading,
    error,
    connectionTested,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};