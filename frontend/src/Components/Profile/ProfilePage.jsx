// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Package,
  LogOut,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  CreditCard as Edit2,
  Trash2,
  Plus,
  ChevronRight,
  Hop as Home,
  Briefcase,
  Map,
  Star,
  Clock,
  CreditCard,
  Gift,
  Heart,
  Shield,
  Truck,
  X,
  Check,
  CircleAlert as AlertCircle,
  Moon,
  Sun,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/auth/authSlice";
import {
  fetchProfile,
  updateProfile,
  fetchAddresses,
  deleteAddress,
  addAddress,
  updateAddress,
} from "./Profileslice";
import { fetchOrders } from "../Checkout/orderSlice";

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileData = useSelector((state) => state.profile.data);
  const profileLoading = useSelector((state) => state.profile.loading);
  const addresses = useSelector((state) => state.profile.addresses);

  const { orders, ordersLoading, ordersError } = useSelector(
    (state) => state.order,
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "M",
    phone: "",
    country: "",
  });

  const [addressForm, setAddressForm] = useState({
    address_name: "",
    first_name: "",
    last_name: "",
    mobile: "",
    pincode: "",
    country: "India",
    address_line_1: "",
    locality_area_street: "",
    locality: "",
    city: "",
    state: "",
    landmark: "",
    is_default: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      dispatch(fetchAddresses());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [activeTab, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!profileData) return;
    const { full_name, email, gender, phoneNumber, country } = profileData;
    setFormData({
      name: full_name || user?.full_name || "",
      email: email || user?.email || "",
      gender: gender || "M",
      phone: phoneNumber || "",
      country: country || "India",
    });
  }, [profileData, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSaveProfile = async () => {
    await dispatch(
      updateProfile({
        full_name: formData.name,
        gender: formData.gender,
        phoneNumber: formData.phone,
        country: formData.country,
      }),
    );
    setIsEditing(false);
    dispatch(fetchProfile());
  };

  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      address_name: "",
      first_name: "",
      last_name: "",
      mobile: "",
      pincode: "",
      country: "India",
      address_line_1: "",
      locality_area_street: "",
      locality: "",
      city: "",
      state: "",
      landmark: "",
      is_default: false,
    });
    setShowAddressModal(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      address_name: addr.address_name || "",
      first_name: addr.first_name || "",
      last_name: addr.last_name || "",
      mobile: addr.mobile || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
      address_line_1: addr.address_line_1 || "",
      locality_area_street: addr.locality_area_street || "",
      locality: addr.locality || "",
      city: addr.city || "",
      state: addr.state || "",
      landmark: addr.landmark || "",
      is_default: addr.is_default || false,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    if (editingAddress) {
      await dispatch(
        updateAddress({
          addressId: editingAddress.address_id,
          updatedData: addressForm,
        }),
      );
    } else {
      await dispatch(addAddress(addressForm));
    }
    await dispatch(fetchAddresses());
    setShowAddressModal(false);
  };

  const handleDeleteAddress = async (id) => {
    await dispatch(deleteAddress(id));
    await dispatch(fetchAddresses());
    setShowDeleteConfirm(null);
  };

  const menuItems = [
    {
      id: "profile",
      label: "Profile Information",
      icon: User,
      description: "Manage your personal details",
    },
    {
      id: "orders",
      label: "Order History",
      icon: Package,
      description: "Track and view your orders",
      badge: orders?.length,
    },
    {
      id: "addresses",
      label: "Saved Addresses",
      icon: MapPin,
      description: "Manage your delivery addresses",
      badge: addresses?.length,
    },
  ];

  const getAddressIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "work":
        return <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 lg:gap-6 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 mb-3 sm:mb-0">
              <User
                size={32}
                className="sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1">
                {formData.name || "Welcome back!"}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-blue-100 flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                <Mail size={14} className="sm:w-4 sm:h-4" />
                <span className="truncate max-w-[200px] sm:max-w-xs">
                  {formData.email}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 -mt-6 sm:-mt-8 pb-8 sm:pb-10 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden sticky top-20 sm:top-24">
              {/* Stats Cards */}
              <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                      {orders?.length || 0}
                    </p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                      Orders
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">
                      {addresses?.length || 0}
                    </p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                      Addresses
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3 sm:p-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 transition-all ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white shadow-md sm:shadow-lg shadow-blue-200"
                        : "hover:bg-blue-50 text-gray-700"
                    }`}
                  >
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg ${
                        activeTab === item.id ? "bg-white/20" : "bg-blue-100"
                      }`}
                    >
                      <item.icon
                        size={16}
                        className={`sm:w-[18px] sm:h-[18px] ${
                          activeTab === item.id ? "text-white" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-xs sm:text-sm">
                        {item.label}
                      </p>
                      <p
                        className={`text-[10px] sm:text-xs hidden sm:block ${
                          activeTab === item.id
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    {item.badge > 0 && (
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          activeTab === item.id
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}

                {/* Support Tickets Link */}
                <Link
                  to="/tickets"
                  className="w-full flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 transition-all hover:bg-purple-50 text-gray-700 group"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <MessageSquare
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] text-purple-600"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-xs sm:text-sm">
                      Support Tickets
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                      View your support requests
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-gray-400 sm:w-4 sm:h-4"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl mt-2 sm:mt-4 text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-rose-100">
                    <LogOut
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] text-rose-600"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-xs sm:text-sm">Sign Out</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                      Logout from your account
                    </p>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">
                        Profile Information
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-0.5 sm:mt-1">
                        Manage your personal details and preferences
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        isEditing ? handleSaveProfile() : setIsEditing(true)
                      }
                      className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all ${
                        isEditing
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md sm:shadow-lg shadow-emerald-200"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md sm:shadow-lg shadow-blue-200"
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Check
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                          <span className="hidden xs:inline">Save Changes</span>
                          <span className="xs:hidden">Save</span>
                        </>
                      ) : (
                        <>
                          <Edit2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />

                          <span className="">Edit</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                          size={16}
                        />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          disabled={!isEditing}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                          size={16}
                        />
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Gender
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                          size={16}
                        />
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          disabled={!isEditing}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 appearance-none"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                          size={16}
                        />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        Country
                      </label>
                      <div className="relative">
                        <Map
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]"
                          size={16}
                        />
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">
                        Order History
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-0.5 sm:mt-1">
                        Track and manage your orders
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all shadow-md sm:shadow-lg shadow-indigo-200"
                      onClick={handleViewAllOrders}
                    >
                      <ShoppingBag
                        size={16}
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                      <span className="">All Orders</span>
                      <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3 sm:mb-4"></div>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                        Loading your orders...
                      </p>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 text-center">
                      <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-rose-500 mx-auto mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base lg:text-lg text-rose-600 font-medium">
                        Error loading orders
                      </p>
                      <p className="text-xs sm:text-sm text-rose-500 mt-1">
                        {ordersError}
                      </p>
                    </div>
                  ) : Array.isArray(orders) && orders.length > 0 ? (
                    <>
                      <div className="space-y-3 sm:space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div
                            key={order.order_uuid}
                            className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-md sm:hover:shadow-lg transition-all group"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="w-full sm:w-auto">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold">
                                    Order #
                                    {order.order_uuid?.toString().slice(0, 8)}
                                    ...
                                  </h3>
                                  <span
                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(order.status)}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                  <Clock
                                    size={12}
                                    className="sm:w-[14px] sm:h-[14px]"
                                  />
                                  Placed on {formatDate(order.created_at)}
                                </p>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto">
                                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800">
                                  ₹
                                  {parseFloat(
                                    order.total_amount,
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {order.total_items}{" "}
                                  {order.total_items === 1 ? "item" : "items"}
                                </p>
                              </div>
                            </div>

                            {/* Payment Method & Fees Breakdown */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 py-3 sm:py-4 border-t border-gray-100">
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                                  Payment Method
                                </p>
                                <p className="text-xs sm:text-sm font-medium flex items-center gap-1">
                                  {order.latest_payment?.payment_type ===
                                  "razorpay" ? (
                                    <>💳 Razorpay</>
                                  ) : order.latest_payment?.payment_type ===
                                    "cod" ? (
                                    <>💵 Cash on Delivery</>
                                  ) : (
                                    "N/A"
                                  )}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  Status:{" "}
                                  {order.latest_payment?.status || "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                                  Subtotal
                                </p>
                                <p className="text-xs sm:text-sm font-medium">
                                  ₹
                                  {parseFloat(order.subtotal).toLocaleString(
                                    "en-IN",
                                    { minimumFractionDigits: 2 },
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                                  Fees
                                </p>
                                <div className="text-[10px] sm:text-xs space-y-0.5">
                                  {parseFloat(order.handling_fee) > 0 && (
                                    <p>Handling: ₹{order.handling_fee}</p>
                                  )}
                                  {parseFloat(order.rain_surge_fee) > 0 && (
                                    <p>Rain Surge: ₹{order.rain_surge_fee}</p>
                                  )}
                                  {parseFloat(order.other_fee) > 0 && (
                                    <p>Other: ₹{order.other_fee}</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                                  Delivery
                                </p>
                                <p className="text-xs sm:text-sm font-medium">
                                  {parseFloat(order.delivery_fee) === 0 ? (
                                    <span className="text-emerald-600">
                                      Free
                                    </span>
                                  ) : (
                                    `₹${order.delivery_fee}`
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Order Items with Images */}
                            {order.items && order.items.length > 0 && (
                              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                                <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                                  <Package
                                    size={14}
                                    className="sm:w-4 sm:h-4 text-gray-500"
                                  />
                                  Order Items ({order.total_items})
                                </p>
                                <div className="space-y-3">
                                  {order.items.slice(0, 2).map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex gap-3 sm:gap-4"
                                    >
                                      {/* Product Image */}
                                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        {item.variant?.images &&
                                        item.variant.images.length > 0 ? (
                                          <img
                                            src={
                                              item.variant.images.find(
                                                (img) => img.is_main,
                                              )?.image_url ||
                                              item.variant.images[0]?.image_url
                                            }
                                            alt={item.product_name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src =
                                                "https://via.placeholder.com/80x80?text=No+Image";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <Package
                                              size={24}
                                              className="text-gray-400"
                                            />
                                          </div>
                                        )}
                                      </div>

                                      {/* Product Details */}
                                      <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                          <div>
                                            <h4 className="text-xs sm:text-sm font-medium">
                                              {item.product_name}
                                            </h4>
                                            <p className="text-[10px] sm:text-xs text-gray-500">
                                              {item.brand_name}
                                            </p>
                                            {item.variant?.attributes && (
                                              <div className="flex flex-wrap gap-2 mt-1">
                                                {item.variant.attributes.map(
                                                  (attr) => (
                                                    <span
                                                      key={attr.id}
                                                      className="text-[10px] sm:text-xs bg-gray-100 px-2 py-0.5 rounded"
                                                    >
                                                      {attr.value}
                                                      {attr.attribute ===
                                                        "v8pXJYUrsu" &&
                                                        attr.meta?.hex && (
                                                          <span
                                                            className="inline-block w-2 h-2 rounded-full ml-1"
                                                            style={{
                                                              backgroundColor:
                                                                attr.meta.hex,
                                                            }}
                                                          />
                                                        )}
                                                    </span>
                                                  ),
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          <div className="text-left sm:text-right">
                                            <p className="text-xs sm:text-sm font-medium">
                                              ₹
                                              {parseFloat(
                                                item.price,
                                              ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                              })}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-gray-500">
                                              Qty: {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {order.items.length > 2 && (
                                    <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium mt-1">
                                      + {order.items.length - 2} more items
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Shipping Address */}
                            {order.shipping_address && (
                              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                                  Shipping Address
                                </p>
                                <p className="text-xs sm:text-sm">
                                  {order.shipping_address.first_name}{" "}
                                  {order.shipping_address.last_name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {order.shipping_address.address_line_1},{" "}
                                  {order.shipping_address.city},{" "}
                                  {order.shipping_address.state} -{" "}
                                  {order.shipping_address.pincode}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                                  <Phone size={10} className="sm:w-3 sm:h-3" />
                                  {order.shipping_address.mobile}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {orders.length > 3 && (
                        <div className="mt-6 sm:mt-8 text-center">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                            Showing 3 of {orders.length} orders
                          </p>
                          <button
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all"
                            onClick={handleViewAllOrders}
                          >
                            View All Orders
                            <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Package
                          className="text-blue-600 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                          size={24}
                        />
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2">
                        No orders yet
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                        Looks like you haven't placed any orders
                      </p>
                      <button
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all shadow-md sm:shadow-lg shadow-blue-200"
                        onClick={() => navigate("/")}
                      >
                        Start Shopping
                        <ChevronRight
                          size={16}
                          className="sm:w-[18px] sm:h-[18px]"
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">
                        Saved Addresses
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-0.5 sm:mt-1">
                        Manage your delivery locations
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all shadow-md sm:shadow-lg shadow-blue-200"
                      onClick={openAddAddress}
                    >
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="">Add</span>
                    </button>
                  </div>

                  {Array.isArray(addresses) && addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                      {addresses.map((addr) => (
                        <div
                          key={addr.address_id}
                          className="relative group border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-md sm:hover:shadow-lg transition-all"
                        >
                          {addr.is_default && (
                            <div className="absolute -top-2 -right-2">
                              <span className="bg-blue-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md sm:shadow-lg flex items-center gap-0.5 sm:gap-1">
                                <Star size={10} className="sm:w-3 sm:h-3" />
                                Default
                              </span>
                            </div>
                          )}

                          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div
                              className={`p-1.5 sm:p-2 rounded-lg ${
                                addr.address_name === "home"
                                  ? "bg-emerald-100"
                                  : addr.address_name === "work"
                                    ? "bg-purple-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              {getAddressIcon(addr.address_name)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base capitalize">
                                {addr.address_name || "Address"}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {addr.first_name} {addr.last_name}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            <p>{addr.address_line_1}</p>
                            <p>{addr.locality_area_street}</p>
                            <p>
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p>{addr.country}</p>
                            <p className="flex items-center gap-1 pt-1 sm:pt-2">
                              <Phone
                                size={12}
                                className="sm:w-3 sm:h-3 text-gray-400"
                              />
                              <span className="text-xs sm:text-sm">
                                {addr.mobile}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Edit2 size={12} className="sm:w-3 sm:h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                setShowDeleteConfirm(addr.address_id)
                              }
                              className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-rose-600 hover:text-rose-700 font-medium"
                            >
                              <Trash2 size={12} className="sm:w-3 sm:h-3" />
                              Delete
                            </button>
                          </div>

                          {/* Delete Confirmation */}
                          {showDeleteConfirm === addr.address_id && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center p-3 sm:p-4 lg:p-6">
                              <div className="text-center">
                                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-rose-500 mx-auto mb-2 sm:mb-3" />
                                <p className="text-sm sm:text-base font-medium mb-1 sm:mb-2">
                                  Delete this address?
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                  This action cannot be undone
                                </p>
                                <div className="flex gap-2 sm:gap-3 justify-center">
                                  <button
                                    onClick={() =>
                                      handleDeleteAddress(addr.address_id)
                                    }
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs sm:text-sm font-medium"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <MapPin
                          size={24}
                          className="text-blue-600 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                        />
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2">
                        No saved addresses
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                        Add an address to speed up checkout
                      </p>
                      <button
                        onClick={openAddAddress}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all"
                      >
                        <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Add Your First Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Address Type
                  </label>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {["home", "work", "other"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="address_name"
                          value={type}
                          checked={addressForm.address_name === type}
                          onChange={handleAddressChange}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
                        />
                        <span className="text-xs sm:text-sm capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={addressForm.first_name}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={addressForm.last_name}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={addressForm.mobile}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address_line_1"
                    value={addressForm.address_line_1}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Area/Street/Locality *
                  </label>
                  <input
                    type="text"
                    name="locality_area_street"
                    value={addressForm.locality_area_street}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressForm.is_default}
                      onChange={handleAddressChange}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
                    />
                    <span className="text-xs sm:text-sm">
                      Set as default address
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-colors shadow-md sm:shadow-lg shadow-blue-200"
              >
                {editingAddress ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

const InputField = ({ label, value, onChange, disabled }) => (
  <div className="space-y-1.5 sm:space-y-2">
    <label className="text-xs sm:text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
    />
  </div>
);

export default ProfilePage;
