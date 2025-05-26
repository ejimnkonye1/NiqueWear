import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/cartcontext';
import { usePaystackPayment } from 'react-paystack';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import ShippingForm from '../checkout/ShippingForm ';
import OrderSummary from '../checkout/orderSummary';
import CheckoutProgress from '../checkout/checkoutprogress';
import OrderConfirmation from '../checkout/orderconfirm';
import PaymentMethod from '../checkout/paymentmethod';
import OrderReview from '../checkout/orderreview';
const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState('shipping');
  const [saveShippingInfo, setSaveShippingInfo] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Nigeria',
    state: '',
    zip: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
 const [createdOrder, setCreatedOrder] = useState(null); // Add this line

  // Calculate order totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + shipping + tax;

  // Paystack config with useMemo to prevent unnecessary re-renders
  const paystackConfig = useMemo(() => ({
    reference: (new Date()).getTime().toString(),
    email: formData.email || 'customer@example.com',
    amount: total * 100, // Paystack uses kobo
    publicKey:  'pk_test_9f04ff1cdc541872fbbdb8816c9057d2b6c883a5',
    currency: 'NGN',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`
        },
        {
          display_name: "Shipping Address",
          variable_name: "shipping_address",
          value: `${formData.address}, ${formData.city}`
        }
      ]
    }
  }), [formData, total]);

  // Initialize Paystack payment
  const initializePayment = usePaystackPayment(paystackConfig);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form before proceeding
  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  // Handle payment success
  const onSuccess = async (reference) => {
    console.log('Payment successful, reference:', reference);
    try {
      setLoading(true);
      
   
      // Prepare order data
      const orderData = {
        ...formData,
        //   userId: user._id  || "6834d109e0f179138ed2fa50",         // Keep user ID for reference
        //  userEmail: user.email || "don@gmail.com", 
        userId: "6834d109e0f179138ed2fa50",         // Keep user ID for reference
         userEmail: "don@gmail.com", 
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        paymentReference: reference.reference,
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total
      };

      console.log('Submitting order to backend:', orderData);
      
      // Submit order to backend
      const response = await axios.post('http://localhost:4500/api/orders', orderData);
      console.log('Order created:', response.data);
          const order = response.data;
      setCreatedOrder(order);
      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      

    } catch (error) {
      console.error('Order processing failed:', error);
      toast.error(`Order failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment close
  const onClose = () => {
    console.log('Payment window closed');
    toast.error("Payment was cancelled");
  };

  // Handle place order
const handlePlaceOrder = () => {
  if (!validateForm()) return;
  
  console.log('Initiating payment with method:', paymentMethod);
  
  if (paymentMethod === 'paystack') {
    try {
      // Initialize Paystack payment with callbacks
      initializePayment({
        onSuccess: (reference) => {
          console.log('Payment successful, reference:', reference);
          onSuccess(reference); // Call your onSuccess function with the reference
        },
        onClose: () => {
          console.log('Payment window closed');
          onClose(); // Call your onClose function
        }
      });
    } catch (err) {
      console.error('Payment initialization error:', err);
      toast.error("Failed to initialize payment");
    }
  } else {
    toast.error("Only Paystack payments are currently supported");
  }
};

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
      toast.error("Your cart is empty");
    }
  }, [cart, orderPlaced, navigate]);

  if (orderPlaced) {
    return (
      <OrderConfirmation
            orderNumber={`ORD-${createdOrder?._id}`} 
        email={createdOrder?.userEmail || formData.email}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="bottom-right" />
      
      {/* Progress Steps */}
      <CheckoutProgress activeStep={activeStep} setActiveStep={setActiveStep} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            {activeStep === 'shipping' && (
              <ShippingForm
                formData={formData}
                handleInputChange={handleInputChange}
                saveShippingInfo={saveShippingInfo}
                setSaveShippingInfo={setSaveShippingInfo}
                nextStep={() => validateForm() && setActiveStep('payment')}
              />
            )}

            {activeStep === 'payment' && (
              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                prevStep={() => setActiveStep('shipping')}
                nextStep={() => setActiveStep('review')}
              />
            )}

            {activeStep === 'review' && (
              <OrderReview
                formData={formData}
                paymentMethod={paymentMethod}
                cart={cart}
                prevStep={() => setActiveStep('payment')}
                placeOrder={handlePlaceOrder}
                loading={loading}
              />
            )}
          </div>

          {/* Order Summary */}
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            activeStep={activeStep}
          />
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;