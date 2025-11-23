import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import { useProducts } from './hooks/useProducts';
import './styles/index.css';

function App() {
  const { products, loading, error, connectionTested, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
    setCategories(uniqueCategories);
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddProduct = () => {
    if (!connectionTested) {
      alert('Please wait for backend connection to be established.');
      return;
    }
    console.log('➕ Add Product button clicked');
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log('✏️ Edit Product clicked:', product);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleProductAdded = () => {
    console.log('🔄 Refreshing product list');
    fetchProducts();
  };

  const handleModalClose = () => {
    console.log('❌ Modal closed');
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Show connection status
  if (!connectionTested) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing backend connection...</p>
          <p className="text-sm text-gray-500">Make sure backend is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Overlay - Remove this after testing */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 10000,
        fontSize: '12px'
      }}>
        <div>Modal Open: {isModalOpen ? 'YES' : 'NO'}</div>
        <div>Editing: {editingProduct ? editingProduct.name : 'None'}</div>
        <div>Products: {products.length}</div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onAddProduct={handleAddProduct}
        />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    <p className="mt-1">Please ensure the backend server is running on port 5000.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <ProductTable
            products={filteredProducts}
            loading={loading}
            error={error}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            onEditProduct={handleEditProduct}
            onAddProduct={handleAddProduct}
          />
        </main>

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onProductAdded={handleProductAdded}
          editingProduct={editingProduct}
          createProduct={createProduct}
          updateProduct={updateProduct}
        />
      </div>
    </div>
  );
}

export default App;