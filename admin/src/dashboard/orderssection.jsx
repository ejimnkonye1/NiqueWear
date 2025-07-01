import { useState } from "react";
import { useEffect } from "react";
import { ErrorDisplay, LoadingSpinner } from "../component/reuse";
import formatAsNaira from "../util/naira";
import { apiClient } from "../util/apiclient";
const OrdersSection = () => {
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])
     const [error, setError] = useState(null)
console.log(orders,'l')
   useEffect(() => {
  const getproduct = async () => {
    setLoading(true);
    try {
      const response = await apiClient.request(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/getallorders`,
        { method: 'GET' }
      );
      
      // Parse the JSON response manually
      const responseData = await response.json();
      
      // Check if `orders` exists in the response
      if (responseData.orders) {
        setOrders(responseData.orders);
        console.log("Orders:", responseData.orders);
      } else {
        console.error("No 'orders' field in response:", responseData);
      }
    } catch (err) {
      // Handle errors (fetch errors won't have `.response.data`)
      const errorMessage = err.message || 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  getproduct();
}, []);
          if (loading) return <LoadingSpinner />;
      if (error) return <ErrorDisplay message={error} />;
    
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-{order._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.lastName}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '---'}
</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {formatAsNaira(order.total.toFixed(0))}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersSection