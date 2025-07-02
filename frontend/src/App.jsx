import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Import components
import Header from './component/header.jsx';
import Footer from './component/footer.jsx';
import WhatsAppLink from './util/whatsapp.jsx';
import ContactInfo from './util/contactInfo.jsx';

// Import pages
import HomePage from './pages/homepage.jsx';
import ProductDetails from './pages/productdetails.jsx';
import CartPage from './pages/cart.jsx';
import CheckoutPage from './pages/checkout.jsx';
import UserDashboard from './pages/userdashboard.jsx';
import LoginPage from './auth/login.jsx';
import RegisterPage from './auth/register.jsx';
import SecondHeader from './component/secondheader.jsx';
import BottomNavbar from './util/bottomnav.jsx';

import Search from './component/search.jsx';
import SmallScreenCategory from './component/category.jsx';

// Loader component
const Loader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
      Loading...
    </h2>
    <p className="text-gray-500 dark:text-gray-400 mt-2">
      Please wait while we fetch your products.
    </p>
  </div>
);
// const Loader = () => (

//     <div className="containerss">
//       <div className="dash first"></div>
//       <div className="dash seconde"></div>
//       <div className="dash third"></div>
//       <div className="dash fourth"></div>
//     </div>
//   );






// Layout component that includes the loader logic
const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delayLoader = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(delayLoader);
  }, []);

  return isLoading ? <Loader /> : children;
};

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation(); // Get the current location

  return (
    <div>
      <Layout>
        {/* Conditionally render Header based on the current route */}
        {location.pathname !== '/login' && location.pathname !== '/register' 
        && location.pathname !== '/userdashboard' &&  
        location.pathname !== '/checkout' &&
        !location.pathname.startsWith('/product/')
        &&  (
          <Header
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
          />
        )}

            {location.pathname !== '/' && location.pathname !== '/cart' && (
          <SecondHeader
          />
        )}
                {  location.pathname !== '/cart' &&
                !location.pathname.startsWith('/product/') &&   location.pathname !== '/checkout' 
                  && location.pathname !== '/userdashboard'  && location.pathname !== '/login' 
              &&  location.pathname !== '/register' &&   (
                <>
                             <Search 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          />
                     <SmallScreenCategory
                  setActiveCategory={setActiveCategory}
                  activeCategory={activeCategory}
             />
     
                </>
        
      

        )}
    
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <HomePage
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
            />
          } />
          <Route path="/product/:name" element={<ProductDetails/>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
        </Routes>
        <ContactInfo />
        <WhatsAppLink />
        <BottomNavbar />
        <Footer />
      </Layout>
    </div>
  );
}

// Wrap App with BrowserRouter
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
