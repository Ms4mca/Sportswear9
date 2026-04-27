import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutAction } from "../../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import {
  X,
  ChevronRight,
  User,
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  Phone,
  LogOut,
  Sparkles,
  Zap,
  Home,
} from "lucide-react";

// Category data with images for the two-pane layout
const categoryData = [
  {
    id: "all-sports",
    name: "All Sports",
    image: "https://contents.mediadecathlon.com/p2340025/k$2fd1bdcc8cba7e3e3efc08e73f77e688/sq/cycling.jpg",
    subcategories: [
      { title: "Outdoor Sports", items: ["Hiking & Trekking", "Camping", "Wildlife Watching", "Rock Climbing"] },
      { title: "Fitness & Yoga", items: ["Fitness & Gym", "Yoga", "Boxing & Martial Arts"] },
      { title: "Water Sports", items: ["Swimming", "Surfing", "Snorkeling & Diving", "Kayaking"] },
      { title: "Racket Sports", items: ["Badminton", "Tennis", "Table Tennis", "Squash"] },
      { title: "Team Sports", items: ["Football", "Basketball", "Cricket", "Volleyball"] },
    ],
  },
  {
    id: "men",
    name: "Men Collection",
    image: "https://contents.mediadecathlon.com/p2474583/k$3a62e4f3acfa3b56c22a04c25b22b4d5/sq/men-collection.jpg",
    subcategories: [
      { title: "Topwear", items: ["T-shirts", "Polo T-shirts", "Tank Tops", "Sweatshirts & Hoodies"] },
      { title: "Bottomwear", items: ["Shorts", "Track Pants", "Trousers", "Tights"] },
      { title: "Footwear", items: ["Sports Shoes", "Running Shoes", "Sandals", "Socks"] },
      { title: "Jackets", items: ["Sports Jackets", "Winter Jackets", "Windcheaters", "Raincoats"] },
    ],
  },
  {
    id: "women",
    name: "Women Collection",
    image: "https://contents.mediadecathlon.com/p2474584/k$f7c3a2d1e8b4a5c6d9e0f1a2b3c4d5e6/sq/women-collection.jpg",
    subcategories: [
      { title: "Topwear", items: ["T-shirts", "Tank Tops", "Crop Tops", "Sweatshirts"] },
      { title: "Bottomwear", items: ["Leggings", "Shorts", "Track Pants", "Skirts"] },
      { title: "Sports Bras", items: ["Low Support", "Medium Support", "High Support"] },
      { title: "Footwear", items: ["Running Shoes", "Training Shoes", "Sandals"] },
    ],
  },
  {
    id: "kids",
    name: "Kids Collection",
    image: "https://contents.mediadecathlon.com/p2340028/k$8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f/sq/kids.jpg",
    subcategories: [
      { title: "Boys", items: ["T-shirts", "Shorts", "Track Pants", "Sports Shoes"] },
      { title: "Girls", items: ["T-shirts", "Leggings", "Dresses", "Sports Shoes"] },
      { title: "School Sports", items: ["School Uniforms", "Sports Kits", "Footwear"] },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://contents.mediadecathlon.com/p2340029/k$1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d/sq/accessories.jpg",
    subcategories: [
      { title: "Bags", items: ["Backpacks", "Sports Bags", "Gym Bags", "Shoe Bags"] },
      { title: "Equipment", items: ["Water Bottles", "Fitness Trackers", "Yoga Mats"] },
      { title: "Protection", items: ["Sunglasses", "Caps", "Gloves", "Knee Guards"] },
    ],
  },
];

const DecathlonMobileSidebar = ({ isOpen, onClose, openAuthModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, profile, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState(categoryData[0]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleAuthClick = () => {
    if (openAuthModal) {
      openAuthModal("login");
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    if (logout) logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[380px] bg-white shadow-2xl z-[70] 
                    transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {isAuthenticated ? (
                <span className="font-bold text-blue-600 text-lg">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              ) : (
                <User size={20} className="text-blue-600" />
              )}
            </div>
            <div>
              {isAuthenticated ? (
                <>
                  <p className="font-semibold text-sm text-gray-900">
                    Hi, {profile?.full_name?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {profile?.email}
                  </p>
                </>
              ) : (
                <button onClick={handleAuthClick} className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Sign In</p>
                  <p className="text-xs text-gray-500">Account & Lists</p>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => handleNavigation("/")}
            className="flex-1 flex flex-col items-center py-3 hover:bg-gray-100 transition-colors"
          >
            <Home size={20} className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button
            onClick={() => isAuthenticated ? handleNavigation("/orders") : handleAuthClick()}
            className="flex-1 flex flex-col items-center py-3 hover:bg-gray-100 transition-colors border-x border-gray-200"
          >
            <Package size={20} className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Orders</span>
          </button>
          <button
            onClick={() => isAuthenticated ? handleNavigation("/wishlist") : handleAuthClick()}
            className="flex-1 flex flex-col items-center py-3 hover:bg-gray-100 transition-colors border-r border-gray-200"
          >
            <Heart size={20} className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Wishlist</span>
          </button>
          <button
            onClick={() => isAuthenticated ? handleNavigation("/cart") : handleAuthClick()}
            className="flex-1 flex flex-col items-center py-3 hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart size={20} className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">Cart</span>
          </button>
        </div>

        {/* Two-Pane Category Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane - Category List */}
          <div className="w-[100px] bg-gray-100 overflow-y-auto border-r border-gray-200">
            {categoryData.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category)}
                className={`w-full p-3 flex flex-col items-center gap-2 transition-colors ${
                  activeCategory.id === category.id
                    ? "bg-white border-l-4 border-blue-600"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/56x56?text=" + category.name.charAt(0);
                    }}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight ${
                    activeCategory.id === category.id ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))}
            
            {/* Special Links */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => handleNavigation("/product/new-arrivals")}
                className="w-full p-3 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Sparkles size={18} className="text-orange-600" />
                </div>
                <span className="text-[10px] font-medium text-orange-600">New</span>
              </button>
              <button
                onClick={() => handleNavigation("/product/clearance")}
                className="w-full p-3 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Zap size={18} className="text-red-600" />
                </div>
                <span className="text-[10px] font-medium text-red-600">Sale</span>
              </button>
            </div>
          </div>

          {/* Right Pane - Subcategories */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              {activeCategory.name}
            </h3>
            
            <Link
              to={`/product/${activeCategory.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mb-4 hover:underline"
            >
              View All
              <ChevronRight size={16} />
            </Link>

            <div className="space-y-5">
              {activeCategory.subcategories.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    {section.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        to={`/product/${activeCategory.id}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={onClose}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-700 
                                   hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 space-y-3">
          {/* Store & Help Links */}
          <div className="flex gap-4">
            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Phone size={16} />
              <span>Help & Contact</span>
            </Link>
            <Link
              to="/stores"
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <MapPin size={16} />
              <span>Find Store</span>
            </Link>
          </div>

          {/* Sign Out / Sign In */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 
                         bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleAuthClick}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg 
                         hover:bg-blue-700 transition-colors"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DecathlonMobileSidebar;
