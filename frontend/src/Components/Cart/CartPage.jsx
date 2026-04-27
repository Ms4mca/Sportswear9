import React, { useEffect } from "react";
import SEO from "../Common/SEO";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Truck,
  CreditCard,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  deleteCartItem,
  updateCartItem,
} from "./Cartslice";
import RecommendedProducts from "../Home/RecommendedProducts";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, total_price, total_items, loading, applied_fees, total_fees, discount_amount } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
        </div>

        

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side Skeleton */}
          <div className="flex-1">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg border p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Image Skeleton */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-lg animate-pulse"></div>

                    {/* Content Skeleton */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <div className="w-10 h-10 bg-gray-100 animate-pulse"></div>
                            <div className="w-12 h-10 bg-gray-50 flex items-center justify-center">
                              <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Order Summary Skeleton */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg border p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
              
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>

              <div className="w-full h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingCart size={64} className="text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold text-lg shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const cartItems = items;
  const total = Number(total_price || subtotal);
  const numericSubtotal = Number(subtotal) || 0;
  const shipping = numericSubtotal > 999 ? 0 : 49;
  const fees = applied_fees || {};
  const numericTotalFees = Number(total_fees) || 0;
  const numericDiscount = Number(discount_amount) || 0;

  // Function to get fee details with descriptions
  const getFeeDetails = (feeName) => {
    const feeDetails = {
      'Handling Fee': {
        description: 'Packaging and processing charges',
        icon: '📦'
      },
      'Delivery Fee': {
        description: 'Standard delivery charges',
        icon: '🚚'
      },
      'Rain/Surge Fee': {
        description: 'Weather or demand-based charges',
        icon: '🌧️'
      },
      'Other Fee': {
        description: 'Miscellaneous additional charges',
        icon: '📝'
      }
    };
    return feeDetails[feeName] || { description: 'Additional charge', icon: '💰' };
  };

  // Function to render all fees
  const renderFees = () => {
    const feeEntries = Object.entries(fees);
    
    if (feeEntries.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic py-1">
          No additional fees applied
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {feeEntries.map(([feeName, feeAmount]) => {
          const amount = Number(feeAmount);
          const feeDetail = getFeeDetails(feeName);
          
          return (
            <div key={feeName} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">{feeDetail.icon}</span>
                <div>
                  <span className="text-gray-700">{feeName}</span>
                  <div className="text-xs text-gray-500">{feeDetail.description}</div>
                </div>
              </div>
              <span className={`font-medium ${amount === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {amount === 0 ? 'FREE' : `₹${amount.toFixed(2)}`}
              </span>
            </div>
          );
        })}
        
        {/* Total Fees Row */}
        {numericTotalFees > 0 && (
          <div className="flex justify-between text-base pt-3 border-t border-gray-200 mt-2">
            <span className="text-gray-700 font-medium">Total Additional Fees</span>
            <span className="font-semibold text-gray-900">
              ₹{numericTotalFees.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    );
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    dispatch(updateCartItem({ id, quantity: newQuantity }))
      .unwrap()
      .then(() => dispatch(fetchCartItems()));
  };

  const removeItem = (id) => {
    dispatch(deleteCartItem(id))
      .unwrap()
      .then(() => dispatch(fetchCartItems()));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {total_items} {total_items === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT SIDE */}
          <div className="flex-1">
            <div className="space-y-4">

              {cartItems.map((item) => {
                const variant = item.variant || {};

                const mainImage =
                  variant.images?.find((img) => img.is_main)?.image_url ||
                  variant.images?.[0]?.image_url ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRis7fc5TzfsaemhRNejz1hqrN_gM0N5f_NyA&s";

                const color =
                  variant.attributes?.[0]?.value || "N/A";

                return (
                  <div
                    key={item.cart_item_id}
                    className="bg-white rounded-lg border p-4 md:p-6 hover:shadow-md"
                  >
                    <div className="flex gap-4">

                      <div className="w-24 h-24 md:w-32 md:h-32">
                        <img
                          src={mainImage}
                          alt={variant.product_name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1 line-clamp-2">
                              {variant.product_name}
                            </h3>

                            <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mb-3">
                              <span>
                                Color: <strong>{color}</strong>
                              </span>
                              <span>
                                Qty: <strong>{item.quantity}</strong>
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.cart_item_id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                          <div>
                            <span className="font-bold text-xl text-gray-900">
                              ₹{item.subtotal?.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cart_item_id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </button>

                              <span className="w-12 text-center font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cart_item_id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg border p-6 sticky top-24">

              <h3 className="font-bold text-xl text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b">
                {/* Subtotal */}
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">
                    Subtotal ({total_items} items)
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{numericSubtotal.toFixed(2)}
                  </span>
                </div>

                {/* Discount (if any) */}
                {numericDiscount > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      -₹{numericDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* All Fees Section */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Additional Charges
                    </h4>
                    <Info size={14} className="text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                    {renderFees()}
                  </div>
                </div>

                
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600 block">
                    ₹{total.toFixed(2)}
                  </span>
                  
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full block text-center py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg mb-4 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-gray-500 text-center mb-4">
                Secure checkout • 100% safe transactions
              </p>

              {/* Payment Methods */}
              <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col items-center">
                  <CreditCard className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Card</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">UPI</span>
                  </div>
                  <span className="text-xs text-gray-500">UPI</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">COD</span>
                  </div>
                  <span className="text-xs text-gray-500">COD</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <RecommendedProducts />

      </div>
    </div>
  );
};

export default CartPage;