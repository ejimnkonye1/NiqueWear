import { useState } from 'react';
import { apiClient } from '../util/apiclient';
import { useDispatch } from 'react-redux';

const LogoutModal = ({ isOpen, onClose }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
   const dispatch = useDispatch();
  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Get refreshToken from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call logout endpoint
      const response = await apiClient.request(`${import.meta.env.VITE_SERVER_URL}/logout`, {
        method: 'POST',
    
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        // Clear all client-side storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
           // Clear Redux user state
        dispatch({ type: 'CLEAR_USER' });
        // Redirect to login page
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className={`px-4 py-2 border border-gray-300 rounded-md ${isLoggingOut ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center ${isLoggingOut ? 'opacity-75' : 'hover:bg-red-700'}`}
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;