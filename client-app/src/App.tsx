import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ProductsPage from './pages/ProductsPage'
import Preloader from './components/Preloader';
import './App.css'
import logo from './assets/logo.png'

/**
 * App - Main application component
 * 
 * Handles search functionality, form navigation, and preloader display.
 */
function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clearEditingProduct, setClearEditingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate app initialization with preloader
  useEffect(() => {
    const initializeApp = async () => {
      // Simulate loading time for assets, API calls, etc.
      await new Promise(resolve => setTimeout(resolve, 3200));
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleAddProduct = () => {
    setClearEditingProduct(true);
    setShowAddForm(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleLogoClick = () => {
    setShowAddForm(false);
    setSearchTerm('');
    setClearEditingProduct(false);
  };

  return (
    <>
      {/* Modern Preloader */}
      <Preloader isVisible={isLoading} />
      
      {/* Main Application */}
      <div className={`app-container ${isLoading ? 'hidden' : ''}`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      
      {/* Header */}
      <header className="app-header">
        <div className="container mx-auto px-3">
          <div className="flex items-center justify-between space-x-6">
            {/* Logo and Title */}
            <div 
              className="flex items-center space-x-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={handleLogoClick}
              title="Go to Products Page"
            >
              <div className="p-1 rounded-xl">
                <img 
                  src={logo} 
                  alt="Product Catalog Logo" 
                  className="object-contain"
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-purple-600 bg-clip-text text-transparent font-sans tracking-wider">
                  TECH SPACE
                </h1>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white bg-opacity-90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={handleSearchClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-purple-400 hover:text-purple-600 transition-colors duration-200" fill="white" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Add Product Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleAddProduct}
                className="bg-blue-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 active:outline-none border-0"
                style={{ outline: 'none', border: 'none' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <ProductsPage 
          showAddForm={showAddForm} 
          setShowAddForm={setShowAddForm}
          searchTerm={searchTerm}
          clearEditingProduct={clearEditingProduct}
          setClearEditingProduct={setClearEditingProduct}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 flex-shrink-0" style={{
    boxShadow:
      '0 -2px 4px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.06)',
    }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mt-2">
            All rights reserved © 2025 <span className="font-semibold text-blue-600">{import.meta.env.VITE_APP_NAME || 'TECH SPACE'}</span>.
          </p>
        </div>
      </footer>
    </div>
    </>
  )
}

export default App
