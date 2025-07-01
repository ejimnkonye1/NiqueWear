import { useState } from "react";
import { useEffect } from "react";

import { ErrorDisplay, LoadingSpinner } from "../component/reuse";
import formatAsNaira from "../util/naira";
import { apiClient } from "../util/apiclient";

const DashboardOverview = () => {
const [loading, setLoading] = useState(false)
const [totalUser, setTotalUser] = useState('')
const [totalproducts, setTotalProducts] = useState('')
const [totalorders, setTotalOrders] = useState('')
const [totalrevenue, setTotalRevenue] = useState('')
const [orders, setOrders] = useState([])
 const [error, setError] = useState(null)
useEffect(() => {
  const getData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersResponse = await apiClient.request(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/getallorders`
      );
      const ordersData = await ordersResponse.json(); // Parse JSON
      console.log("Orders response:", ordersData); // Debug log

      // Fetch users
      const usersResponse = await apiClient.request(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/getallusers`
      );
      const usersData = await usersResponse.json(); // Parse JSON
      console.log("Users response:", usersData); // Debug log

      // Update state (adjust paths based on actual response)
      setTotalUser(usersData.total); // Check if it's `usersData.total` or `usersData.data.total`
      setTotalOrders(ordersData.totalorder);
      setTotalProducts(ordersData.totalproducts);
      setTotalRevenue(ordersData.totalRevenue);
      setOrders(ordersData.orders);
    } catch (err) {
      setError(err.message || 'Failed to fetch');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  getData();
}, []);
      if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              
    

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
<p className="text-2xl font-bold">
  {formatAsNaira(Math.round(totalrevenue))}
</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{totalorders}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{totalproducts}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{totalUser}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">

                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
             <tbody className="bg-white divide-y divide-gray-200">
  {orders.map((order) => (
    <tr key={order._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        ORD-{order.paymentReference.slice(-4)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {order.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          order.status === 'paid' ? 'bg-green-100 text-green-800' :
          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatAsNaira(order.total.toFixed(0))}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default DashboardOverview