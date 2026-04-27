import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Check,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  addAddress,
  deleteAddress,
  fetchProfile,
} from "../Profile/Profileslice";
import { placeOrder, resetOrderState, checkTask } from "./orderSlice";
import {
  createRazorpayOrder,
  verifyPayment,
  resetPaymentState,
  setPaymentStatus,
} from "./paymentSlice";
import { fetchCartItems, clearCart } from "../Cart/Cartslice";
import useRazorpay from "../../hooks/useRazorpay";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoaded: razorpayLoaded, openCheckout } = useRazorpay();

  const {
    addresses,
    loading: addressLoading,
    data: profileData,
  } = useSelector((state) => state.profile);
  const {
    loading: orderLoading,
    taskId,
    error: orderError,
  } = useSelector((state) => state.order);
  const {
    items: cartItems,
    total_price,
    subtotal: cartSubtotal,
    total_items,
    loading: cartLoading,
  } = useSelector((state) => state.cart);
  const {
    razorpayOrder,
    razorpayLoading,
    razorpayError,
    verificationLoading,
    verificationError,
    paymentStatus,
  } = useSelector((state) => state.payment);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [processingState, setProcessingState] = useState(null); // 'placing_order' | 'checking_task' | 'creating_payment' | 'processing_payment' | 'verifying' | 'success' | 'failed'
  const [orderUuid, setOrderUuid] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Updated newAddress state with all required fields
  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    street_address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    address_type: "home",
    is_default: false,
  });

  // Set standard delivery as default with 0 cost
  const [formData, setFormData] = useState({
    paymentMethod: "razorpay",
    deliveryOption: "standard",
  });

  // Transform cart items for display
  const orderItems = cartItems.map((item) => {
    const variant = item.variant || {};
    const mainImage =
      variant.images?.find((img) => img.is_main) || variant.images?.[0];
    const sizeAttribute = variant.attributes?.find(
      (attr) =>
        attr.attribute === "MZ2aiek9kr" ||
        attr.value === "XS" ||
        attr.value === "S" ||
        attr.value === "M" ||
        attr.value === "L" ||
        attr.value === "XL" ||
        attr.value === "XXL",
    );
    const colorAttribute = variant.attributes?.find(
      (attr) => attr.attribute === "NpPQsJrWak" || attr.meta?.hex,
    );

    return {
      id: item.cart_item_id,
      name: mainImage?.alt_text || `Product ${item.cart_name}`,
      image:
        mainImage?.image_url ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRis7fc5TzfsaemhRNejz1hqrN_gM0N5f_NyA&s",
      price: Number(variant.effective_price) || Number(variant.price) || 0,
      quantity: Number(item.quantity),
      size: sizeAttribute?.value || "Standard",
      color: colorAttribute?.value || "",
      colorHex: colorAttribute?.meta?.hex,
      subtotal: Number(item.subtotal) || 0,
    };
  });

  // Calculate delivery cost based on selected option
  const getDeliveryCost = () => {
    switch (formData.deliveryOption) {
      case "standard":
        return 0;
      case "express":
        return 99;
      default:
        return 0;
    }
  };

  // Calculate prices
  const subtotal =
    Number(cartSubtotal) ||
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = getDeliveryCost(); // Use function to get shipping cost
  
  const total =
    Number(total_price) + shipping  || subtotal + shipping ; // Add shipping to total

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCartItems());
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddressId(
        defaultAddress?.address_id || addresses[0].address_id,
      );
    }
  }, [addresses, selectedAddressId]);

  // Pre-fill address form with profile data when profile is loaded
  useEffect(() => {
    if (profileData && showAddAddressForm) {
      const fullName = profileData.full_name || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setNewAddress((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        mobile: profileData.phone_number || "",
        pincode: "",
      }));
    }
  }, [profileData, showAddAddressForm]);

  // Poll for task status when we have a taskId
  useEffect(() => {
    let pollInterval;

    if (taskId && processingState === "checking_task") {
      pollInterval = setInterval(async () => {
        try {
          const result = await dispatch(checkTask(taskId)).unwrap();

          if (result.status === "SUCCESS") {
            clearInterval(pollInterval);
            const orderUuidFromResult = result.result?.order_uuid;
            setOrderUuid(orderUuidFromResult);

            // Check payment method - for COD, go directly to success
            if (formData.paymentMethod === "cod") {
              setProcessingState("success");
              dispatch(clearCart());
            } else {
              // For Razorpay, create payment order
              setProcessingState("creating_payment");
              dispatch(createRazorpayOrder(orderUuidFromResult));
            }
          } else if (result.status === "FAILURE") {
            clearInterval(pollInterval);
            setProcessingState("failed");
            setErrorMessage("Order processing failed. Please try again.");
          }
        } catch (error) {
          clearInterval(pollInterval);
          setProcessingState("failed");
          setErrorMessage(error.message || "Failed to check order status");
        }
      }, 2000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [taskId, processingState, dispatch, formData.paymentMethod]);

  // Handle Razorpay order creation success
  useEffect(() => {
    if (razorpayOrder && processingState === "creating_payment") {
      handleRazorpayCheckout();
    }
  }, [razorpayOrder, processingState]);

  // Handle Razorpay error
  useEffect(() => {
    if (razorpayError && processingState === "creating_payment") {
      setProcessingState("failed");
      setErrorMessage(razorpayError);
    }
  }, [razorpayError, processingState]);

  // Handle verification success
  useEffect(() => {
    if (paymentStatus === "success") {
      setProcessingState("success");
      dispatch(clearCart());
    }
  }, [paymentStatus, dispatch]);

  // Handle verification error
  useEffect(() => {
    if (verificationError) {
      setProcessingState("failed");
      setErrorMessage(verificationError);
    }
  }, [verificationError]);

  const handleRazorpayCheckout = async () => {
    if (!razorpayLoaded) {
      setErrorMessage("Payment system is loading. Please wait...");
      return;
    }

    setProcessingState("processing_payment");

    try {
      const paymentResponse = await openCheckout({
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.razorpay_order_id,
        name: "Sportswear9",
        description: `Order ${razorpayOrder.order_uuid}`,
        prefill: {
          email: profileData?.email || "",
          contact: profileData?.phone_number || "",
          name: profileData?.full_name || "",
        },
        theme: {
          color: "#2563eb",
        },
        notes: {
          order_uuid: razorpayOrder.order_uuid,
        },
      });

      // Payment successful - verify with backend
      setProcessingState("verifying");

      await dispatch(
        verifyPayment({
          order_uuid: razorpayOrder.order_uuid,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          method: "razorpay",
        }),
      ).unwrap();
    } catch (error) {
      setProcessingState("failed");
      setErrorMessage(error.message || "Payment failed or was cancelled");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      setShowAddAddressForm(false);
      // Reset form to initial state
      setNewAddress({
        first_name: "",
        last_name: "",
        mobile: "",
        street_address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        address_type: "home",
        is_default: false,
      });
      dispatch(fetchAddresses());
    } catch (error) {
      alert("Failed to add address: " + error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      } catch (error) {
        alert("Failed to delete address: " + error);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddressId) {
      alert("Please select or add a delivery address");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    if (orderItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessingState("placing_order");
    setErrorMessage(null);

    try {
      console.log("Placing order with:", {
        address_id: selectedAddressId,
        payment_method: formData.paymentMethod,
      });

      // Send both address_id and payment_method
      const result = await dispatch(
        placeOrder({
          address_id: selectedAddressId,
          payment_method: formData.paymentMethod,
        }),
      ).unwrap();

      console.log("Order result:", result);

      if (result.task_id) {
        setProcessingState("checking_task");
      } else {
        throw new Error("No task ID received");
      }
    } catch (error) {
      console.error("Order error:", error);
      setProcessingState("failed");
      setErrorMessage(error.message || "Failed to place order");
    }
  };

  const handleRetry = () => {
    setProcessingState(null);
    setErrorMessage(null);
    setOrderUuid(null);
    dispatch(resetOrderState());
    dispatch(resetPaymentState());
  };

  const handleGoToOrders = () => {
    dispatch(resetOrderState());
    dispatch(resetPaymentState());
    navigate("/orders");
  };

  const steps = [
    { number: 1, title: "Shipping", icon: Truck },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Review", icon: Shield },
  ];

  const selectedAddress = addresses?.find(
    (addr) => addr.address_id === selectedAddressId,
  );

  // Processing Modal
  const renderProcessingModal = () => {
    if (!processingState) return null;

    const stateConfig = {
      placing_order: {
        icon: Loader2,
        text: "Placing your order...",
        spinning: true,
      },
      checking_task: {
        icon: Loader2,
        text: "Processing your order...",
        spinning: true,
      },
      creating_payment: {
        icon: Loader2,
        text: "Setting up payment...",
        spinning: true,
      },
      processing_payment: {
        icon: CreditCard,
        text: "Complete payment in Razorpay window...",
        spinning: false,
      },
      verifying: {
        icon: Loader2,
        text: "Verifying payment...",
        spinning: true,
      },
      success: {
        icon: CheckCircle,
        text:
          formData.paymentMethod === "cod"
            ? "Order Placed Successfully!"
            : "Payment Successful!",
        spinning: false,
      },
      failed: { icon: XCircle, text: "Order Failed", spinning: false },
    };

    const config = stateConfig[processingState];
    const Icon = config.icon;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              processingState === "success"
                ? "bg-green-100"
                : processingState === "failed"
                  ? "bg-red-100"
                  : "bg-blue-100"
            }`}
          >
            <Icon
              size={40}
              className={`${
                processingState === "success"
                  ? "text-green-600"
                  : processingState === "failed"
                    ? "text-red-600"
                    : "text-blue-600"
              } ${config.spinning ? "animate-spin" : ""}`}
            />
          </div>

          <h3
            className={`text-xl font-bold mb-2 ${
              processingState === "success"
                ? "text-green-700"
                : processingState === "failed"
                  ? "text-red-700"
                  : "text-gray-900"
            }`}
          >
            {config.text}
          </h3>

          {processingState === "success" && (
            <>
              <p className="text-gray-600 mb-2">Order ID: {orderUuid}</p>
              <p className="text-gray-600 mb-6">Thank you for your purchase!</p>
              <button
                onClick={handleGoToOrders}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                View My Orders
              </button>
            </>
          )}

          {processingState === "failed" && (
            <>
              <p className="text-gray-600 mb-6">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Back to Cart
                </button>
              </div>
            </>
          )}

          {processingState === "processing_payment" && (
            <p className="text-gray-500 text-sm mt-4">
              Don't close this window. Complete the payment in the Razorpay
              popup.
            </p>
          )}
        </div>
      </div>
    );
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-0">
      {renderProcessingModal()}

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Link
            to="/cart"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-400"
                    } transition-all duration-300`}
                  >
                    {currentStep > step.number ? (
                      <Check size={18} className="font-bold" />
                    ) : (
                      <step.icon size={18} />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs md:text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 md:w-24 h-1 mx-2 md:mx-4 rounded-full ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 md:px-6 py-4 border-b border-blue-100">
                <h2 className="text-lg md:text-xl font-bold text-blue-900 flex items-center gap-2">
                  {currentStep === 1 && (
                    <>
                      <Truck size={20} /> Delivery Address
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <CreditCard size={20} /> Payment Method
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <Shield size={20} /> Review Order
                    </>
                  )}
                </h2>
              </div>

              <div className="p-4 md:p-6">
                {currentStep === 1 && (
                  <div>
                    {addressLoading ? (
                      <div className="text-center py-8">
                        Loading addresses...
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6">
                          {addresses && addresses.length > 0 ? (
                            addresses.map((address) => (
                              <label
                                key={address.address_id}
                                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedAddressId === address.address_id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="selectedAddress"
                                  value={address.address_id}
                                  checked={
                                    selectedAddressId === address.address_id
                                  }
                                  onChange={() =>
                                    setSelectedAddressId(address.address_id)
                                  }
                                  className="mt-1 mr-4 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm md:text-base capitalize">
                                      {address.address_type || "Home"}
                                    </span>
                                    {address.is_default && (
                                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {address.street_address}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {address.city}, {address.state}{" "}
                                    {address.pincode}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {address.country}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAddress(address.address_id);
                                  }}
                                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </label>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-600">
                              No saved addresses. Please add a new address.
                            </div>
                          )}
                        </div>

                        {!showAddAddressForm ? (
                          <button
                            onClick={() => setShowAddAddressForm(true)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Plus size={20} />
                            Add New Address
                          </button>
                        ) : (
                          <form
                            onSubmit={handleAddAddress}
                            className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50"
                          >
                            <h3 className="font-semibold mb-4 text-lg">
                              Add New Address
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {/* First Name - Required */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  First Name *
                                </label>
                                <input
                                  type="text"
                                  name="first_name"
                                  value={newAddress.first_name}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              {/* Last Name - Required */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Last Name *
                                </label>
                                <input
                                  type="text"
                                  name="last_name"
                                  value={newAddress.last_name}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              {/* Mobile - Required */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mobile Number *
                                </label>
                                <input
                                  type="tel"
                                  name="mobile"
                                  value={newAddress.mobile}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Street Address *
                                </label>
                                <input
                                  type="text"
                                  name="street_address"
                                  value={newAddress.street_address}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  City *
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={newAddress.city}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  State *
                                </label>
                                <input
                                  type="text"
                                  name="state"
                                  value={newAddress.state}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  PIN Code *
                                </label>
                                <input
                                  type="text"
                                  name="pincode"
                                  value={newAddress.pincode || ""}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Country
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  value={newAddress.country}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div className="mb-6">
                                <label className="block text-xs text-gray-500 mb-2 font-medium">
                                  Address Type
                                </label>
                                <div className="relative">
                                  <select
                                    name="address_type"
                                    value={newAddress.address_type}
                                    onChange={handleNewAddressChange}
                                    className="w-full p-2.5 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                                  >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                              </div>

                              <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={newAddress.is_default}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        is_default: e.target.checked,
                                      })
                                    }
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">
                                    Set as default address
                                  </span>
                                </label>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                              >
                                Save Address
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowAddAddressForm(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        <div className="mt-6">
                          <h3 className="text-base md:text-lg font-semibold mb-4">
                            Delivery Options
                          </h3>
                          <div className="space-y-3">
                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <input
                                type="radio"
                                name="deliveryOption"
                                value="standard"
                                checked={formData.deliveryOption === "standard"}
                                onChange={handleInputChange}
                                className="mr-4 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm md:text-base">
                                    Standard Delivery
                                  </span>
                                  <span className="text-sm md:text-base font-semibold">
                                    FREE
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">
                                  5-7 business days
                                </p>
                              </div>
                            </label>

                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <input
                                type="radio"
                                name="deliveryOption"
                                value="express"
                                checked={formData.deliveryOption === "express"}
                                onChange={handleInputChange}
                                className="mr-4 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm md:text-base">
                                    Express Delivery
                                  </span>
                                  <span className="text-sm md:text-base font-semibold">
                                    ₹99
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">
                                  2-3 business days
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-base md:text-lg font-medium mb-4">
                        Payment Method
                      </h3>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === "razorpay"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={formData.paymentMethod === "razorpay"}
                            onChange={handleInputChange}
                            className="mr-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.paymentMethod === "razorpay"
                                  ? "bg-blue-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <CreditCard
                                className={`w-5 h-5 ${
                                  formData.paymentMethod === "razorpay"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div>
                              <span className="font-medium text-sm md:text-base block">
                                Razorpay
                              </span>
                              <span className="text-xs text-gray-600">
                                Cards, UPI, Netbanking, Wallets
                              </span>
                            </div>
                          </div>
                        </label>

                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === "cod"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === "cod"}
                            onChange={handleInputChange}
                            className="mr-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                formData.paymentMethod === "cod"
                                  ? "bg-blue-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <Truck
                                className={`w-5 h-5 ${
                                  formData.paymentMethod === "cod"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div>
                              <span className="font-medium text-sm md:text-base block">
                                Cash on Delivery
                              </span>
                              <span className="text-xs text-gray-600">
                                Pay when you receive
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === "razorpay" && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Secure payment via Razorpay. You'll be redirected to
                          complete payment.
                        </p>
                      </div>
                    )}

                    {formData.paymentMethod === "cod" && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm md:text-base text-yellow-800">
                          You will pay ₹{total.toLocaleString()} when your order
                          is delivered.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    {selectedAddress && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                        <h3 className="font-medium text-base md:text-lg mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Shipping Address
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 capitalize">
                          {selectedAddress.address_type || "Home"}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">
                          {selectedAddress.street_address}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">
                          {selectedAddress.city}, {selectedAddress.state}{" "}
                          {selectedAddress.pincode}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">
                          {selectedAddress.country}
                        </p>
                      </div>
                    )}

                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                      <h3 className="font-medium text-base md:text-lg mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </h3>
                      <p className="text-sm md:text-base text-gray-700 capitalize">
                        {formData.paymentMethod === "razorpay"
                          ? "Razorpay (Cards, UPI, Netbanking)"
                          : "Cash on Delivery"}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium text-base md:text-lg mb-4">
                        Delivery Option
                      </h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-sm md:text-base block">
                              {formData.deliveryOption === "standard"
                                ? "Standard Delivery"
                                : "Express Delivery"}
                            </span>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                              {formData.deliveryOption === "standard"
                                ? "5-7 business days"
                                : "2-3 business days"}
                            </p>
                          </div>
                          <span className="font-semibold text-sm md:text-base">
                            {formData.deliveryOption === "standard"
                              ? "FREE"
                              : "₹99"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium text-base md:text-lg mb-4">
                        Order Items ({total_items})
                      </h3>
                      <div className="space-y-4">
                        {orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80x80?text=No+Image";
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm md:text-base">
                                {item.name}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600">
                                Size: {item.size}
                              </p>
                              <p className="text-xs md:text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="font-medium text-sm md:text-base">
                                ₹{item.price.toLocaleString()} × {item.quantity}{" "}
                                = ₹
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
                      disabled={orderLoading}
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base shadow-md hover:shadow-lg"
                      disabled={orderLoading || orderItems.length === 0}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={
                        orderLoading ||
                        !selectedAddressId ||
                        orderItems.length === 0
                      }
                    >
                      {formData.paymentMethod === "razorpay"
                        ? "Pay Now"
                        : "Place Order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-6">
                Order Summary
              </h3>

              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                  <Link
                    to="/products"
                    className="block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm md:text-base line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">
                            Size: {item.size}
                          </p>
                          <p className="font-medium text-sm md:text-base">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-gray-600">
                        Subtotal ({total_items} items)
                      </span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {/* Delivery Option Cost */}
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-gray-600">Delivery</span>
                      <span
                        className={
                          shipping === 0 ? "text-green-600 font-medium" : ""
                        }
                      >
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>

                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg md:text-xl font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.deliveryOption === "standard"
                          ? "Free standard delivery (5-7 days)"
                          : "Express delivery (2-3 days)"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Shield size={16} />
                      <span className="text-sm font-medium">
                        Secure Checkout
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
