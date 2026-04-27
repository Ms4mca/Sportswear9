import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../Checkout/orderSlice';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  RefreshCw, 
  ChevronRight, 
  ExternalLink, 
  ShoppingBag, 
  ArrowRight, 
  MoreVertical, 
  Star 
} from 'lucide-react';

const OrdersPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  
  const dispatch = useDispatch();
  const { orders, ordersLoading, ordersError } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Transform API data to match component structure
  const transformOrderData = (apiOrder) => {
    // Map status from API to component status
    const statusMap = {
      'PENDING': 'pending',
      'PROCESSING': 'processing',
      'SHIPPED': 'shipped',
      'DELIVERED': 'delivered'
    };
    
    // Get first image from variant images or use a default
    const getFirstImage = (variant) => {
      if (variant?.images && variant.images.length > 0) {
        return variant.images[0].image_url;
      }
      return 'https://via.placeholder.com/100x100?text=No+Image';
    };

    // Extract size from attributes
    const getSizeFromAttributes = (attributes) => {
      if (!attributes) return 'Standard';
      const sizeAttribute = attributes.find(attr => 
        attr.attribute === 'MZ2aiek9kr' || 
        ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(attr.value)
      );
      return sizeAttribute ? sizeAttribute.value : 'Standard';
    };

    // Extract color from attributes
    const getColorFromAttributes = (attributes) => {
      if (!attributes) return 'Default';
      const colorAttribute = attributes.find(attr => 
        attr.attribute === 'NpPQsJrWak' || 
        (attr.meta && attr.meta.hex)
      );
      return colorAttribute ? colorAttribute.value : 'Default';
    };

    const items = apiOrder.items?.map(item => ({
      id: item.id,
      name: item.product_name,
      image: getFirstImage(item.variant),
      quantity: item.quantity,
      price: parseFloat(item.price) || 0,
      size: getSizeFromAttributes(item.variant?.attributes),
      color: getColorFromAttributes(item.variant?.attributes),
      brand: item.brand_name,
      subtotal: parseFloat(item.subtotal) || 0
    })) || [];

    // Format shipping address
    const shippingAddress = apiOrder.shipping_address ? 
      `${apiOrder.shipping_address.address_line_1}, ${apiOrder.shipping_address.locality_area_street || ''}, ${apiOrder.shipping_address.locality}, ${apiOrder.shipping_address.city}, ${apiOrder.shipping_address.state} ${apiOrder.shipping_address.pincode}, ${apiOrder.shipping_address.country}` :
      'No shipping address provided';

    return {
      id: apiOrder.order_uuid?.substring(0, 8).toUpperCase() || 'ORDER',
      fullId: apiOrder.order_uuid || '',
      date: apiOrder.created_at || new Date().toISOString(),
      status: statusMap[apiOrder.status] || 'pending',
      total: parseFloat(apiOrder.total_amount) || 0,
      items: items,
      shippingAddress: shippingAddress,
      trackingNumber: `TRK-${(apiOrder.order_uuid || '').substring(0, 10)}`,
      orderDate: apiOrder.created_at,
      paymentStatus: apiOrder.latest_payment?.status || 'No Payment',
      totalItems: apiOrder.total_items || 0
    };
  };

  // Filter orders by status
  const getFilteredOrders = () => {
    const transformedOrders = Array.isArray(orders) ? orders.map(transformOrderData) : [];
    
    if (activeFilter === 'all') {
      return showAllOrders ? transformedOrders : transformedOrders.slice(0, 4);
    }
    
    const filtered = transformedOrders.filter(order => order.status === activeFilter);
    return showAllOrders ? filtered : filtered.slice(0, 4);
  };

  const filteredOrders = getFilteredOrders();
  const allTransformedOrders = Array.isArray(orders) ? orders.map(transformOrderData) : [];

  const filters = [
    { id: 'all', label: 'All Orders', count: allTransformedOrders.length },
    { id: 'delivered', label: 'Delivered', count: allTransformedOrders.filter(order => order.status === 'delivered').length },
    { id: 'shipped', label: 'Shipped', count: allTransformedOrders.filter(order => order.status === 'shipped').length },
    { id: 'processing', label: 'Processing', count: allTransformedOrders.filter(order => order.status === 'processing').length },
    { id: 'pending', label: 'Pending', count: allTransformedOrders.filter(order => order.status === 'pending').length },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-600" size={20} />;
      case 'shipped': return <Truck className="text-blue-600" size={20} />;
      case 'processing': return <RefreshCw className="text-yellow-600" size={20} />;
      case 'pending': return <Clock className="text-orange-600" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      default: return 'Processing';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-48"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="h-3 bg-gray-100 rounded w-16 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ChevronRight className="text-gray-300" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-white"></div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="h-9 bg-gray-100 rounded-lg w-32"></div>
              <div className="h-9 bg-gray-100 rounded-lg w-32"></div>
              <div className="h-9 bg-gray-100 rounded-lg w-32 ml-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error State
  if (ordersError) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Package className="mx-auto text-red-300 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">
              {ordersError}
            </p>
            <button
              onClick={() => dispatch(fetchOrders())}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
            >
              Try Again
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Track, return, or buy things again</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {allTransformedOrders.length} orders • Last 3 months
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Buy Again
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
              >
                <span className="font-medium">{filter.label}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === filter.id
                    ? 'bg-blue-500'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {ordersLoading && <LoadingSkeleton />}

        {/* Orders List */}
        {!ordersLoading && (
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.fullId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-gray-900">Order #{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            <span className="flex items-center gap-1.5">
                              {getStatusIcon(order.status)}
                              {getStatusText(order.status)}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.date)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.totalItems} item{order.totalItems !== 1 ? 's' : ''} • Payment: {order.paymentStatus}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg border-2 border-white object-cover"
                            onError={(e) => {
                              e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBejnHUB24A33v0Bt4sYrl1A0YSFIOEWu6dg&s';
                            }}
                          />
                          {index === 2 && order.items.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      
                      {/* <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                        Track Package
                      </button> */}
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                          <Star size={14} />
                          Rate & Review
                        </button>
                      )}
                      <button
                          onClick={() => setExpandedOrder(expandedOrder === order.fullId ? null : order.fullId)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                        <p className="px-4 py-2 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                        Details
                      </p>
                        </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.fullId && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Items ({order.totalItems})</h4>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} × {formatCurrency(item.price)}
                                </p>
                                <p className="text-xs text-gray-500">{item.brand} • {item.size} • {item.color}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
                                <p className="text-xs text-gray-500">Item total</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h4>
                            <p className="text-gray-700 bg-white p-4 rounded-lg">{order.shippingAddress}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Tracking Information</h4>
                            <div className="flex items-center justify-between bg-white p-4 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                                <p className="text-sm text-gray-600">Tracking ID</p>
                              </div>
                              <ExternalLink className="text-blue-600" size={18} />
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Shipping</span>
                              <span className="font-medium">FREE</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t">
                              <span className="font-semibold">Total</span>
                              <span className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : !ordersLoading && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h2>
                <p className="text-gray-600 mb-6">
                  {activeFilter === 'all' 
                    ? "You haven't placed any orders yet"
                    : `You don't have any ${activeFilter} orders`
                  }
                </p>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
                >
                  Start Shopping
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show More Button */}
        {!ordersLoading && allTransformedOrders.length > 4 && !showAllOrders && filteredOrders.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllOrders(true)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              View All Orders ({allTransformedOrders.length})
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {!ordersLoading && showAllOrders && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllOrders(false)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;