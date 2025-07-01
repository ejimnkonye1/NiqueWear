import { useState, useEffect } from "react";
import axios from 'axios';
import { ErrorDisplay, LoadingSpinner } from "../util/loader";
import { useSelector } from "react-redux";
import { FiDollarSign, FiPrinter, FiShoppingBag, FiTruck, FiUser, FiX } from "react-icons/fi";
import formatAsNaira from "../currency/naira";

const OrdersSection = ({orders}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const user = useSelector((state) => state.user);

  

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
            
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-gray-500">Start shopping to see your orders here</p>
                    <a
                        href="/"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order #
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ORD-{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()} 
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.items.length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatAsNaira(order.total.toFixed(0))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleViewOrder(order)} 
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Enhanced Modal for Order Details */}
         {selectedOrder && (
  <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Order Details</h3>
            <p className="text-indigo-100 text-sm mt-1">
              #{selectedOrder._id.slice(-6).toUpperCase()} • {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button 
            onClick={closeModal} 
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1">
        {/* Status Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Order Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              selectedOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
              selectedOrder.status === 'paid' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {selectedOrder.status}
            </span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  {selectedOrder.paymentMethod}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {formatAsNaira(selectedOrder.total.toFixed(0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FiUser className="mr-2" /> Customer Information
            </h4>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-28">Name:</span>
                <span>{selectedOrder.firstName} {selectedOrder.lastName}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-28">Email:</span>
                <span>{selectedOrder.email}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-28">Phone:</span>
                <span>{selectedOrder.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FiTruck className="mr-2" /> Shipping Address
            </h4>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-28">Address:</span>
                <span>{selectedOrder.address}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-28">City/State:</span>
                <span>{selectedOrder.city}, {selectedOrder.state}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-28">Country/Zip:</span>
                <span>{selectedOrder.country}, {selectedOrder.zip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <FiShoppingBag className="mr-2" /> Order Items ({selectedOrder.items.length})
          </h4>
          <div className="border rounded-lg divide-y">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="p-4 flex items-start hover:bg-gray-50 transition-colors">
                <div className="relative flex-shrink-0 mr-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/80?text=No+Image";
                    }}
                  />
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow">
                  <h5 className="font-medium">{item.name}</h5>
                  <p className="text-sm text-gray-500">SKU: {item.productId.slice(-6)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatAsNaira(item.price.toFixed(0))}</p>
                  <p className="text-sm text-gray-500">  Total: {formatAsNaira((item.price * item.quantity).toFixed(0))}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-gray-50 p-5 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <FiDollarSign className="mr-2" /> Order Summary
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatAsNaira(selectedOrder.subtotal.toFixed(0))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatAsNaira(selectedOrder.shipping)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-indigo-600">{formatAsNaira(selectedOrder.total.toFixed(0))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-white flex justify-end space-x-3">
        <button 
          onClick={closeModal}
          className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button 
          onClick={() => window.print()}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <FiPrinter className="mr-2" /> Print Receipt
        </button>
      </div>
    </div>
  </div>
)}
        </div>
    );
};

export default OrdersSection;