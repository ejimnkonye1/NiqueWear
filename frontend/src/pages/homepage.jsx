import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CategoryHeader from '../home/categoryheader';
import FilterSidebar from '../home/filtersidebar';
import Quickview from '../home/quickview';
import Products from '../home/product';
import Pagination from '../reuseable/pagination';
import SkeletonLoader from '../reuseable/skeleton';

const HomePage = ({activeCategory, setActiveCategory, searchQuery, setSearchQuery}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState([0, 100000]); // Increased max price
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(true);
 const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Items per page

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  // Fetch products based on active category
useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    setIsLoading(true); // Set isloading to true when fetching starts
    setError('');

    try {
      let endpoint = `${import.meta.env.VITE_SERVER_URL}/products`;
      
      if (activeCategory === 'men') {
        endpoint = `${import.meta.env.VITE_SERVER_URL}/products/men`;
      } else if (activeCategory === 'women') {
        endpoint = `${import.meta.env.VITE_SERVER_URL}/products/women`;
      }

      const response = await axios.get(endpoint);
      
      // Validate the response data structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid products data format');
      }

      const formattedProducts = response.data.map(product => ({
        ...product,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price) 
          : product.price
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to fetch products';
      
      setError(errorMessage);
      console.error('Fetch products error:', err);
      
      // Reset products to empty array on error
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
      setIsLoading(false); // Set isloading to false when fetching is complete
    }
  };

  fetchProducts();
}, [activeCategory]);

   

  // Filter products based on search and price
  useEffect(() => {
    let result = [...products];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Price filter
    result = result.filter(product => 
      product.price >= priceFilter[0] && product.price <= priceFilter[1]
    );
    
    setFilteredProducts(result);
  }, [products, searchQuery, priceFilter]);



  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceFilter([2000, 100000]);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, priceFilter]);

    console.log("loading homepage", loading)
  return (
    <div className="min-h-screen bg-gray-50">

      {loading && (
     <SkeletonLoader count={4} /> 
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <main className="container mx-auto px-4 py-8">
          <CategoryHeader 
            activeCategory={activeCategory}
            filteredProducts={filteredProducts}
          />

          <div className="flex flex-col md:flex-row gap-8">
            <FilterSidebar 
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
            />
            
            <div className="flex-1">
            <Products
         loading={loading}
            resetFilters={resetFilters}
         filteredProducts={currentProducts}
         setQuickViewProduct={setQuickViewProduct}
         isloading={isloading}
             />
                   <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            </div>
            </div>
          </div>
        </main>
      )}

      <AnimatePresence>
        {quickViewProduct && (
         <Quickview 
         setQuickViewProduct={setQuickViewProduct}
         quickViewProduct={quickViewProduct}
         />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;