import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, fetchSearchResults } from "../Search/Searchslice";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../store/slices/auth/authSlice";
import { 
  fetchStoreDetails, 
  selectStoreDetails, 
  selectIsStoreDetailsCacheValid 
} from "../../store/slices/storeDetailsSlice";
import logo from "../../assets/blacklogo.svg";
import AuthModal from "../Auth/AuthModal";
import MobileSidebar from "./MobileSidebar";
import LocationSelector from "./LocationSelector";

// Lucide icons
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Phone,
  Heart,
  Package,
  LogOut,
  Clock,
  Star,
  Tag,
  Truck,
  Shield,
  Sparkles,
  Zap,
  Watch,
  Mail,
} from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Get store settings from Redux
  const storeDetails = useSelector(selectStoreDetails);
  const isCacheValid = useSelector(selectIsStoreDetailsCacheValid);
  
  const navRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Fetch store settings on component mount
  useEffect(() => {
    if (!isCacheValid) {
      dispatch(fetchStoreDetails());
    }
  }, [dispatch, isCacheValid]);

  // Updated category structure with subcategories and UUIDs
  const categories = [
  {
    name: "Men Collection",
    link: "men",
    uuid: "CAT-2K1IB7LW79YM",
    icon: "",
    color: "text-blue-600",
    subcategories: [
      { name: "Cargo's", uuid: "CAT-AHAWZ8ERKUKR" },
      { name: "Cargo Short", uuid: "CAT-8G3KVTZH7A14" },
      { name: "Combos", uuid: "CAT-84GDC3O2217I" },
      { name: "Compression T-Shirt", uuid: "CAT-TGEPWZC0LH2I" },
      { name: "Jacket's", uuid: "CAT-VRA5SI56WH7O" },
      { name: "Winter Jacket's", uuid: "CAT-15ZNZ8XQLUVI" },
      { name: "Leggings", uuid: "CAT-4WXHNIHRSVQC" },
      { name: "Lower's", uuid: "CAT-UOOJLBUFR5MA" },
      { name: "Shorts", uuid: "CAT-I3SN3Q9WQWDW" },
      { name: "Sports Tighty", uuid: "CAT-BXZFOKADNMYX" },
      { name: "Stringer's / Vest", uuid: "CAT-L4DRAJ5L4IDS" },
      { name: "Full T-shirt", uuid: "CAT-QXN8PXG620K7" },
      { name: "Half T-shirt", uuid: "CAT-ENRBM07MSYHL" },
      { name: "Track Suit", uuid: "CAT-T8U71N4QVG71" },
      { name: "Men's Swimwear", uuid: "CAT-1GKHQN7MT57T" },
    ],
  },
  {
    name: "Women Collection",
    link: "women",
    uuid: "CAT-35P2PK4DU9Z7",
    icon: "",
    color: "text-pink-600",
    subcategories: [
      { name: "Capri", uuid: "CAT-PIW6YWQ6THYY" },
      { name: "Coat Set", uuid: "CAT-9SH9D0HYT5MB" },
      { name: "Combos", uuid: "CAT-TYQMF45N4WOL" },
      { name: "Compression Set's", uuid: "CAT-DL7LZEQCQNHI" },
      { name: "Compression T-shirt", uuid: "CAT-6DWKYVUCWE6D" },
      { name: "Crop-Top", uuid: "CAT-HIY486Z0OE82" },
      { name: "Legging's", uuid: "CAT-48KWXZH93RJU" },
      { name: "Gym Legging's", uuid: "CAT-ZCANRMEVMCAU" },
      { name: "Running short's", uuid: "CAT-423ZN7DONYVC" },
      { name: "Short's", uuid: "CAT-FWIASX8J9W0R" },
      { name: "Sleeve Less", uuid: "CAT-1JWEFAST9J72" },
      { name: "Sport's Top", uuid: "CAT-WWB1Z7DDB13T" },
      { name: "Sports's Bra", uuid: "CAT-2LK3M1L42QS4" },
      { name: "Tight's", uuid: "CAT-0B893646KNCZ" },
      { name: "Women's Swimwear", uuid: "CAT-2AST89DFS7KI" },
      { name: "Yoga Pant", uuid: "CAT-0KTD5VZAGHJW" },
      { name: "Gym T-shirt", uuid: "CAT-URYC153XPYJD" },
      { name: "Women T-shirt", uuid: "CAT-T54OYLLXGFJ0" },
      { name: "Jacket's", uuid: "CAT-IBJ2N8W4CCPP" },
    ],
  },
  {
    name: "Kids Collection",
    link: "kids",
    uuid: "CAT-PILL10S0K656",
    icon: "",
    color: "text-green-600",
    subcategories: [
      { name: "Jacket", uuid: "CAT-JYJKQ2HY3YU8" },
      { name: "Jersey", uuid: "CAT-G8HICP5CDDMF" },
      { name: "Short's", uuid: "CAT-VDX2BIGITHIC" },
      { name: "Sports Pants", uuid: "CAT-3R4IP4Q0AEEM" },
      { name: "Full T-shirt", uuid: "CAT-GWP6ZC6UY28Y" },
      { name: "Half T-shirt", uuid: "CAT-893Q9FNKHC0K" },
      { name: "Kid's Swimwear", uuid: "CAT-GTIT93IYCPUZ" },
    ],
  },
  {
    name: "Swimwear",
    link: "swimwear",
    uuid: "CAT-DRN29WQIHDYX",
    icon: "",
    color: "text-cyan-600",
    subcategories: [
      { name: "Beach Wear", uuid: "CAT-AGLG4B6WIYL3" },
      { name: "Shorts", uuid: "CAT-82YCG2FQ22HE" },
      { name: "Swim Frock", uuid: "CAT-90I40K8MWKGJ" },
      { name: "Swim Suit's", uuid: "CAT-T8JKDDLT848U" },
      { name: "Swim T-shirt's", uuid: "CAT-I8RGZB5J1T0G" },
      { name: "Swim Tight's", uuid: "CAT-ZTI75V3AFCFP" },
      { name: "Swimming Trunk", uuid: "CAT-4YUWWY663QYJ" },
    ],
  },
  {
    name: "Accessories",
    link: "accessories",
    uuid: "CAT-0SKR7DWMD1G7",
    icon: "",
    color: "text-yellow-600",
    subcategories: [
      { name: "Arm Pad", uuid: "CAT-3EAHD6CBTZYY" },
      { name: "Arm Sleeves", uuid: "CAT-98COIETNZ83W" },
      { name: "Bottle's", uuid: "CAT-KJWTY5MULA7A" },
      { name: "Calf", uuid: "CAT-EUXGMLAFT3TK" },
      { name: "Gym Bags", uuid: "CAT-P7Z3BQ8IMAWN" },
      { name: "Gym Belt", uuid: "CAT-BLQCYYCZJDT6" },
      { name: "Gym Glove's", uuid: "CAT-AE2ER3X39KQ9" },
      { name: "Head Band", uuid: "CAT-YT34VBBE9YPH" },
      { name: "Healmet Cap", uuid: "CAT-6XVU86W15RVE" },
      { name: "Knee Cap", uuid: "CAT-UF0ZGDCCLQ8H" },
      { name: "Knee Pad", uuid: "CAT-9CA1UV690VZM" },
      { name: "Skating Suit", uuid: "CAT-VQ8CLW3GI2AF" },
      { name: "Stocking's", uuid: "CAT-S57M0BOW1DBO" },
      { name: "Supporter", uuid: "CAT-NUDU8G1PN7U3" },
      { name: "Wrist Band", uuid: "CAT-QTWTDHLZJLF1" },
      { name: "Wrist Supporter", uuid: "CAT-C9GDKIUISV21" },
    ],
  },
];

  const placeholders = [
    "Sports shoes",
    "Fitness apparel",
    "Gym equipment",
    "Running gear",
    "Swimwear",
    "Sports accessories",
    "Training shoes",
    "Yoga mats",
    "Sports bags",
    "Protective gear",
  ];

  // Typing effect for search placeholder
  useEffect(() => {
    // Only run typing effect when input is empty and not focused
    if (localSearch.length > 0 || isInputFocused) return;

    const currentPlaceholderText = placeholders[currentPlaceholder];
    let currentIndex = 0;
    let typingInterval;
    let deletingInterval;

    const typeText = () => {
      if (currentIndex <= currentPlaceholderText.length) {
        setTypingText(currentPlaceholderText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);

        // Wait a bit before starting to delete
        setTimeout(() => {
          deleteText();
        }, 1500);
      }
    };

    const deleteText = () => {
      let deleteIndex = currentPlaceholderText.length;

      deletingInterval = setInterval(() => {
        if (deleteIndex >= 0) {
          setTypingText(currentPlaceholderText.substring(0, deleteIndex));
          deleteIndex--;
        } else {
          clearInterval(deletingInterval);
          setIsTyping(true);
          // Move to next placeholder
          setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }
      }, 50);
    };

    if (isTyping) {
      typingInterval = setInterval(typeText, 100);
    }

    return () => {
      clearInterval(typingInterval);
      clearInterval(deletingInterval);
    };
  }, [currentPlaceholder, isTyping, localSearch, isInputFocused]);

  // Handle input focus
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  // Handle input blur
  const handleInputBlur = () => {
    setIsInputFocused(false);
  };



  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = (e) => {
  e.preventDefault();
  const q = (localSearch || "").trim();
  if (!q) return;

  dispatch(setSearchQuery(q));
  dispatch(fetchSearchResults(q));
  
  // Navigate to categories page with search query
  navigate(`/categories?q=${encodeURIComponent(q)}`);

  setShowSearch(false);
  setLocalSearch("");
};

  const handleSuggestionClick = (suggestion) => {
    const q = String(suggestion || "").trim();
    if (!q) return;

    dispatch(setSearchQuery(q));
    dispatch(fetchSearchResults(q));
    navigate(`/categories?q=${encodeURIComponent(q)}`);

    setShowSearch(false);
    setLocalSearch("");
  };

  const clearSearch = () => {
    setLocalSearch("");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // Calculate if we should show typing animation
  const shouldShowTypingAnimation = localSearch.length === 0 && !isInputFocused;

  return (
    <>
      {/* Top Bar with dynamic store details - Mobile Optimized */}
      <div className="w-full bg-blue-600 text-white text-[10px] sm:text-sm py-1.5 sm:py-2">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <Truck size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span className="truncate max-w-[120px] sm:max-w-none">Free delivery over ₹1000</span>
              </div>
              <div className="hidden md:flex items-center space-x-0.5 sm:space-x-1">
                <Clock size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span>7-day returns</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {storeDetails?.address && (
                <Link
                  to={storeDetails.address}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 flex items-center space-x-0.5 sm:space-x-1"
                >
                  <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
                  <span className="hidden xs:inline text-[10px] sm:text-sm">Store</span>
                </Link>
              )}
              {storeDetails?.storePhone && (
                <Link
                  to={`https://wa.me/${storeDetails.storePhone}?text=hello%20sportswear9%20can%20u%20help%20me`}
                  className="hover:text-blue-200 flex items-center space-x-0.5 sm:space-x-1"
                >
                  <Phone size={12} className="sm:w-[14px] sm:h-[14px]" />
                  <span className="hidden xs:inline text-[10px] sm:text-sm">Help</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Mobile Optimized */}
      <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto px-2 sm:px-4">
          {/* First Row: Logo, Search, Account - Mobile Optimized */}
          <div className="flex items-center justify-between py-2 sm:py-4">
            {/* Logo - Smaller on mobile */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={storeDetails?.logo || logo} 
                alt={storeDetails?.storeName || "Sportswear9"} 
                className="h-8 sm:h-8 md:h-10"
                onError={(e) => {
                  e.target.src = logo; // Fallback to default logo if API logo fails to load
                }}
              />
            </Link>

            {/* Desktop Search - Hidden on mobile */}
            <div
              className="hidden xl:flex flex-1 max-w-2xl mx-8 relative"
              ref={searchContainerRef}
            >
              <div className="w-full">
                <form onSubmit={handleSearch} className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={shouldShowTypingAnimation ? "" : "Search for products..."}
                    className="w-full pl-12 pr-12 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 "
                  />

                  {/* Search placeholder with typing effect */}
                  {shouldShowTypingAnimation && (
                    <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="flex items-center">
                        <span className="text-gray-500">Search for </span>
                        <span className="relative inline-flex items-center ml-1">
                          <span className="text-gray-800">{typingText}</span>
                          {typingText.length > 0 && (
                            <span className="inline-block w-0 ml-0.5 text-gray-800 animate-pulse text-lg">
                              |
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {localSearch && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <X
                        className="text-gray-400 hover:text-gray-600"
                        size={20}
                      />
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Right Side Icons - Mobile Optimized */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              {/* Location Selector - Hidden on small mobile, visible on larger screens */}
              <div className="">
                <LocationSelector />
              </div>
    

              {/* Mobile Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="xl:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
                aria-label="Search"
              >
                <Search size={22} className="sm:w-[22px] sm:h-[22px] text-gray-700" />
              </button>

              {/* Account - Mobile Optimized */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() =>
                    isAuthenticated
                      ? navigate("/profile")
                      : (setAuthMode("login"), setAuthOpen(true))
                  }
                  className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="sm:w-[22px] sm:h-[22px] text-blue-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {isAuthenticated
                        ? user?.full_name?.split(" ")[0] || "Account"
                        : "Sign In"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isAuthenticated ? "My Account" : "Account"}
                    </div>
                  </div>
                </button>

              
              </div>

              {/* Cart - Mobile Optimized */}
              {!isAuthenticated ? (
                <div
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg relative cursor-pointer"
                  onClick={() => (setAuthMode("login"), setAuthOpen(true))}
                >
                  <ShoppingBag size={22} className="sm:w-[22px] sm:h-[22px] text-gray-700" />
                  <div className="hidden md:block absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    Cart
                  </div>
                </div>
              ) : (
                <Link
                  to="/cart"
                  className="flex p-1.5 sm:p-2  hover:bg-gray-100 rounded-full "
                >
                  <ShoppingBag size={22} className="inline sm:w-[35px] rounded-full sm:h-[35px] bg-blue-100 text-blue-600 p-2" />
                  <div className="hidden md:inline text-sm font-medium text-gray-800 my-auto ml-1">
                    Cart
                  </div>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(true)}
                className="xl:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Menu"
              >
                <Menu size={22} className="sm:w-[24px] sm:h-[24px] text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Improved for small screens */}
          {showSearch && (
            <div className="xl:hidden pb-3 sm:pb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={shouldShowTypingAnimation ? "" : "Search products..."}
                    className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </form>
                
                {/* Mobile typing effect */}
                {shouldShowTypingAnimation && (
                  <div className="absolute left-9 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Search </span>
                      <span className="relative inline-flex items-center ml-1">
                        <span className="text-gray-800">{typingText}</span>
                        {typingText.length > 0 && (
                          <span className="inline-block w-0 ml-0 text-gray-800 animate-pulse text-base">
                            |
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {localSearch && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X
                      className="text-gray-400 hover:text-gray-600"
                      size={16}
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Categories Navigation Bar - Hidden on mobile */}
          <div className="hidden xl:block border-t border-gray-100 pt-1">
             <div className="flex items-center justify-between">
              {/* All Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-900 hover:text-blue-600 font-medium text-sm 2xl:text-base">
                  <span className="font-bold uppercase">All Categories</span>
                  <ChevronDown size={20} />
                </button>

                {/* Mega Menu for All Categories */}
                <div className="absolute top-full left-0 mt-0 w-[1000px] bg-white border border-gray-200 shadow-2xl z-40 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="p-4 grid grid-cols-5 gap-4">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <h3
                            className={`font-bold text-sm 2xl:text-base ${category.color}`}
                          >
                            {category.name}
                          </h3>
                        </div>
                        <ul className="space-y-0.5 mt-1">
                          {category.subcategories.map((sub, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/product/${sub.uuid}`}
                                className="text-sm 2xl:text-sm text-gray-600 hover:text-blue-600 hover:underline"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Promo Section */}
                  <div className="bg-gray-50 border-t p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Link to="/product/new-arrivals">
                        <div className="flex items-center space-x-1">
                          <Sparkles className="text-purple-500" size={16} />
                          <span className="font-medium text-sm 2xl:text-base">
                            New Arrivals
                          </span>
                        </div>
                      </Link>
                    </div>
                    <Link
                      to="/product/flash-clearance-sale"
                      className="text-red-600 font-semibold text-sm 2xl:text-base hover:underline"
                    >
                      Shop All Clearance →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Individual Category Links */}
              <div className="flex items-center space-x-0">
                {categories.slice(0, 8).map((category) => (
                  <div key={category.name} className="relative group">
                    <Link
                      to={`/product/${category.uuid}`}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm 2xl:text-base"
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <span className="font-semibold uppercase">{category.name}</span>
                    </Link>

                    {/* Category-specific dropdown */}
                    {hoveredCategory === category.name && (
                      <div
                        className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-200 shadow-xl z-40 animate-slideDown"
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <div className="p-3">
                          <div className="space-y-1 mb-3">
                            <div className="text-base font-semibold text-blue-600">
                              Categories
                            </div>
                            <ul className="space-y-0.5">
                              {category.subcategories.map((sub, idx) => (
                                <li key={idx}>
                                  <Link
                                    to={`/product/${sub.uuid}`}
                                    className="text-sm text-gray-700 hover:text-blue-600 block py-0.5 hover:underline"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right side links */}
              <div className="flex items-center gap-4">
                <Link
                  to="/ContactUs"
                  className="text-pink-600 font-semibold hover:underline flex items-center text-sm 2xl:text-base"
                >
                  Contact
                </Link>
                <Link
                  to="/product/new-arrivals"
                  className="text-purple-600 font-semibold hover:underline flex items-center text-sm 2xl:text-base"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/product/flash-clearance-sale"
                  className="text-red-600 font-semibold hover:underline flex items-center text-sm 2xl:text-base"
                >
                  Clearance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Promo Bar - Mobile Optimized */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 border-b overflow-x-auto hide-scrollbar">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-start sm:justify-center space-x-3 sm:space-x-6 py-1.5 sm:py-2 text-[10px] sm:text-sm whitespace-nowrap">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Truck size={12} className="sm:w-[16px] sm:h-[16px] text-blue-600" />
              <span>Free over ₹1000</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Star size={12} className="sm:w-[16px] sm:h-[16px] text-blue-600" />
              <span>Rated 4.8/5</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Tag size={12} className="sm:w-[16px] sm:h-[16px] text-blue-600" />
              <span>Price match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={open}
        onClose={() => setOpen(false)}
        openAuthModal={(mode) => {
          setAuthMode(mode);
          setAuthOpen(true);
        }}
        categories={categories}
      />

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
        />
      )}

      {/* CSS Animations and Mobile Utilities */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .group:hover .group-hover\\:visible {
          visibility: visible;
          opacity: 1;
        }
        
        .group-hover\\:visible {
          visibility: hidden;
          opacity: 0;
          transition: all 0.2s ease;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-pulse {
          animation: blink 1s infinite;
        }

        /* Hide scrollbar for promo bar on mobile */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Extra small screen breakpoint */
        @media (min-width: 360px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;