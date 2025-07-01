import { BiPurchaseTagAlt } from "react-icons/bi"
import {  FiLogOut,  FiSettings, FiShoppingBag, FiUser } from "react-icons/fi"
import { useSelector } from "react-redux";
import capitalizeFirstLetter from "../util/cap";
import LogoutModal from "./logoutmodal";
import { useState } from "react";


const UserSidebar = ({setActiveTab,orders, activeTab}) => {
      const user = useSelector((state) => state.user);
      const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : '';
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return(
      <>

        <div>
                 <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          {/* User Profile Summary */}
                          <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
      {firstLetter}
    </div>

                              <div>
                                <h2 className="font-medium text-gray-900">{capitalizeFirstLetter(user.username)}</h2>
<p className="text-sm text-gray-500">
  Member since {user?.joinDate ? new Date(user.joinDate).getFullYear() : '----'}
</p>
                              </div>
                            </div>
                          </div>
            
                          {/* Navigation */}
                          <nav className="p-4">
                            <ul className="space-y-1">
                              <li>
                                <button
                                  onClick={() => setActiveTab('overview')}
                                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                  <span className="flex items-center">
                                    <FiUser className="mr-3" />
                                    Overview
                                  </span>
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => setActiveTab('orders')}
                                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                  <span className="flex items-center">
                                    <FiShoppingBag className="mr-3" />
                                    My Orders
                                  </span>
                                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {orders.length}
                                  </span>
                                </button>
                              </li>

                  
                              <li>
                                <button
                                  onClick={() => setActiveTab('settings')}
                                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                  <span className="flex items-center">
                                    <FiSettings className="mr-3" />
                                    Account Settings
                                  </span>
                                </button>
                              </li>
                              <li>
                                <button 
                                    onClick={() => setIsLogoutModalOpen(true)}
                                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                                  <FiLogOut className="mr-3" />
                                  Sign Out
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
            
                        {/* Sustainability Badge */}
                   
                      </aside>
            
        </div>
              <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
               
            />
                  </>
    )
}
export default UserSidebar