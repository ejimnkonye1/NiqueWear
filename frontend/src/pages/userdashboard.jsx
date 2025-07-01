import { useState } from 'react';
import {  FiEdit, } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import SettingsSection from '../dashboard/setting';
import AddressesSection from '../dashboard/addressesection';
import OrdersSection from '../dashboard/ordersection';
import UserSidebar from '../dashboard/sidebar';
import Recentorders from '../dashboard/recentorders';
import ProfileSection from '../dashboard/profilesection';
import { ErrorDisplay, LoadingSpinner } from '../util/loader';
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../util/apiclient';
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ });
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
      
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false)
  const [savingerror, setSavingError] = useState(null)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    useEffect(() => {
    if (!user) {
      toast.error('Please login to access dashboard');
      navigate('/login');
    } else {
      // Initialize user data if user exists
      // setUserData({
      //   username: user.username || '',
      //   email: user.email || '',
      //   phoneNumber: user.phoneNumber || '',
      //   joinDate: user.joinDate || ''
      // });
    }
  }, [user, navigate]);

  // If no user, return null (will redirect from useEffect)
  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

 const saveProfileChanges = async () => {
    try {
      setSaving(true);
      const response = await apiClient.request(
        `${import.meta.env.VITE_SERVER_URL}/api/updateuser/${user._id}`,
        
         {
        method: 'PUT',
        body: JSON.stringify({
          username: userData.username,
          phoneNumber: userData?.phoneNumber,
        }),
      }
    
        
      );
      
      
      setUserData(response.data.updatedUser);
      toast.success("User updated successfully!")
   dispatch({
        type: 'UPDATE_USER',
        payload: {
          username: userData.username,
          phoneNumber: userData.phoneNumber,
        }
      });
      setEditMode(false);
    } catch (err) {
      setSavingError(err.response?.data?.message || 'Failed to update profile');
      toast.error(savingerror);
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

useEffect(() => {
  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.request(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${user.email}`,
        {
          method: 'GET', // Specify the method
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json(); // Parse the response as JSON
      setOrders(data || []);
      console.log("Orders fetched:", data);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders'); // Use err.message here
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  getOrders();
}, [user.email]);



  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersSection orders={orders} />;
      case 'addresses':
        return <AddressesSection orders={orders} />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection userData={userData} orders={orders} />;
    }
  };

     if (loading) return <LoadingSpinner />;
      if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
   <Toaster position="top-center" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
     <UserSidebar
     setActiveTab={setActiveTab}
     userData={userData}
     orders={orders}
     activeTab={activeTab}
     />

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
                  {editMode ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveProfileChanges}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                      >
                          {saving ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Saving...
    </>
  ) : (
    " Save Changes"
  )}
                       
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <FiEdit className="mr-1" /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Profile Section */}
               <ProfileSection 
                editMode={editMode}
                userData={userData}
                handleInputChange={handleInputChange}
               />

                {/* Recent Orders */}
             <Recentorders 
   orders={orders}
   setActiveTab={setActiveTab}
             />
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const OverviewSection = ({ userData, orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Content already included in the main component */}
    </div>
  );
};







export default UserDashboard;