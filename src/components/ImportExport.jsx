import React, { useRef } from 'react';
import { productsAPI } from '../services/api';

const ImportExport = ({ onImportComplete }) => {
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    try {
      const response = await productsAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting products: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await productsAPI.import(formData);
      alert(`Import completed!\nAdded: ${response.data.added}\nSkipped: ${response.data.skipped}`);
      onImportComplete();
    } catch (error) {
      alert('Error importing products: ' + (error.response?.data?.error || error.message));
    } finally {
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex space-x-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv"
        className="hidden"
      />
      
      <button
        onClick={handleImportClick}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Import CSV
      </button>
      
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Export CSV
      </button>
    </div>
  );
};

export default ImportExport;