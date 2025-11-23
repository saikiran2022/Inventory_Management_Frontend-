import React, { useState } from 'react';

const ProductRow = ({ product, onUpdate, onDelete, onEdit, onViewHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...product });

  const handleSave = async () => {
    const result = await onUpdate(product.id, editData);
    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.error);
    }
  };

  const handleCancel = () => {
    setEditData({ ...product });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
      status: field === 'stock' ? (parseInt(value) > 0 ? 'In Stock' : 'Out of Stock') : prev.status
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  const statusColor = product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <tr 
      className="table-row-hover cursor-pointer"
      onClick={onViewHistory}
    >
      {/* Image */}
      <td className="px-6 py-4 whitespace-nowrap">
        <img
          src={product.image || '/placeholder-image.jpg'}
          alt={product.name}
          className="h-10 w-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
      </td>

      {/* Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
        )}
      </td>

      {/* Unit */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm text-gray-900">{product.unit}</div>
        )}
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm text-gray-900">{product.category}</div>
        )}
      </td>

      {/* Brand */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm text-gray-900">{product.brand}</div>
        )}
      </td>

      {/* Stock */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="number"
            value={editData.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
            min="0"
          />
        ) : (
          <div className="text-sm text-gray-900">{product.stock}</div>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
          {product.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-900"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-900"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;