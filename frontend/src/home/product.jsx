import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';
import { Link } from "react-router-dom";
import { useCart } from '../context/cartcontext';
import formatAsNaira from '../currency/naira';
import capitalizeFirstLetter from '../util/cap';
import { Toaster, toast } from 'react-hot-toast';
import SkeletonLoader from '../reuseable/skeleton';

const Products = ({ filteredProducts, resetFilters, setQuickViewProduct, loading, isloading }) => {
  const { addToCart } = useCart();

  const addtoCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <>
      <Toaster position="bottom-right" />

      {
      filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {filteredProducts.map(product => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="relative">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">Product Image</span>
                  )}
                </div>
                
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Quick View
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/product/${product.name}`}>
                  <h3 className="font-medium text-gray-900 mb-1">{capitalizeFirstLetter(product.name)}</h3>
                </Link>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {formatAsNaira(Math.round(product.price))}
                  </span>
                  <button
                    onClick={() => addtoCart(product)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100"
                  >
                    <FiShoppingBag size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}

export default Products;
