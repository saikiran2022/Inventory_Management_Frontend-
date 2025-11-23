import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onProductAdded, editingProduct, createProduct, updateProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: 'Piece',
    category: '',
    brand: '',
    stock: 0,
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or when editing product changes
  useEffect(() => {
    if (isOpen) {
      console.log('📝 Modal opened, editingProduct:', editingProduct);
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || '',
          unit: editingProduct.unit || 'Piece',
          category: editingProduct.category || '',
          brand: editingProduct.brand || '',
          stock: editingProduct.stock || 0,
          image: editingProduct.image || ''
        });
      } else {
        setFormData({
          name: '',
          unit: 'Piece',
          category: '',
          brand: '',
          stock: 0,
          image: ''
        });
      }
      setError('');
    }
  }, [isOpen, editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔄 Form submission started');
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.name.trim()) {
        setError('Product name is required');
        setLoading(false);
        return;
      }
      if (!formData.unit.trim()) {
        setError('Unit is required');
        setLoading(false);
        return;
      }
      if (!formData.category.trim()) {
        setError('Category is required');
        setLoading(false);
        return;
      }
      if (!formData.brand.trim()) {
        setError('Brand is required');
        setLoading(false);
        return;
      }
      if (formData.stock < 0) {
        setError('Stock cannot be negative');
        setLoading(false);
        return;
      }

      console.log('📦 Submitting product data:', formData);

      let result;
      if (editingProduct) {
        console.log('✏️ Updating existing product:', editingProduct.id);
        result = await updateProduct(editingProduct.id, formData);
      } else {
        console.log('🆕 Creating new product');
        result = await createProduct(formData);
      }

      console.log('📦 Product operation result:', result);

      if (result.success) {
        console.log('✅ Product operation successful');
        onProductAdded();
        onClose();
      } else {
        console.error('❌ Product operation failed:', result.error);
        setError(result.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('❌ Unexpected error in form submission:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  {error && (
                    <div className="p-3 mt-3 text-sm text-red-700 bg-red-100 rounded-md">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Unit *</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Piece">Piece</option>
                        <option value="Box">Box</option>
                        <option value="Pack">Pack</option>
                        <option value="Kg">Kg</option>
                        <option value="Liter">Liter</option>
                        <option value="Meter">Meter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category *</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Electronics, Stationery"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand *</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter brand name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  editingProduct ? 'Update Product' : 'Add Product'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;