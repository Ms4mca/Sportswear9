import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  Users,
  Tag,
  IndianRupee,
  Percent,
  ArrowUpDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
} from "../Product/productslice";

import { fetchSearchResults, setSearchQuery } from "./Searchslice";

import { ProductCard } from "../Product/Product";

const FIXED_BRANDS = [
  "All",
  "Gymific",
  "KyK",
  "NeverLose",
  "Ninq",
  "Sportsinger",
  "Train Hard",
  "U",
  "WMX",
  "Work for it",
];

const FIXED_GENDERS = ["All", "Men", "Women", "Unisex"];

const placeholders = [
  "running shoes...",
  "your perfect sportswear...",
  "trending styles...",
  "athletic wear...",
  "latest collections...",
];

const transformProductData = (p) => ({
  id: p.product_uuid,
  product_uuid: p.product_uuid,
  title: p.name || p.title,
  price: p.price ? String(p.price) : `₹${p.net || p.price || ""}`,
  original: p.original || "",
  discount: p.discount || p.disc || "",
  brand: typeof p.brand === "object" ? p.brand?.name : p.brand,
  category: p.category?.name || p.category || "Uncategorized",
  gender: p.gender || null,
  img: p.img ? p.img : null,
  img2: p.img2 ? p.img2 : null,
  rating: parseFloat(p.average_rating || p.rating) || 4.2,
  priceValue: Number(p.price || p.net || 0),
  isFeatured: p.is_featured,
  tags: Array.isArray(p.tags) ? p.tags : [],
  discountValue: p.discount ? parseInt(p.discount.replace("%", "")) : 0,
});

// Custom Skeleton Loader Component for Product Grid - FIXED GRID LAYOUT
const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-300 relative">
            <div className="absolute top-2 left-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
            {/* Brand Skeleton */}
            <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/4"></div>

            {/* Title Skeleton */}
            <div className="space-y-1 sm:space-y-2">
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-2 sm:h-3 bg-gray-300 rounded w-2/3"></div>
            </div>

            {/* Category Tag Skeleton */}
            <div className="h-3 sm:h-5 bg-gray-300 rounded w-1/3"></div>

            {/* Price Skeleton */}
            <div className="space-y-1 sm:space-y-2">
              <div className="h-3 sm:h-5 bg-gray-400 rounded w-1/2"></div>
              <div className="flex items-center gap-2">
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-7 sm:h-9 bg-gray-300 rounded mt-1 sm:mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

function FilterSection({
  searchTerm,
  setSearchTerm,
  selectedBrand,
  setSelectedBrand,
  selectedGender,
  setSelectedGender,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minDiscount,
  setMinDiscount,
  maxDiscount,
  setMaxDiscount,
  sortBy,
  setSortBy,
  applyFilters,
  clearFilters,
  showMobileFilters,
  setShowMobileFilters,
  activeFiltersCount,
  isMobile = false,
}) {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    discount: true,
    gender: true,
    sort: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Scroll to top when mobile filters open
  useEffect(() => {
    if (isMobile && showMobileFilters) {
      const filterContainer = document.querySelector(".mobile-filters-scroll");
      if (filterContainer) {
        filterContainer.scrollTop = 0;
      }
    }
  }, [isMobile, showMobileFilters]);

  return (
    <>
      {/* Filters Container */}
      <div
        className={`
        w-full bg-white p-3 sm:p-5 rounded-xl border border-gray-200 h-fit sticky top-24 shadow-sm
        ${isMobile ? "h-full flex flex-col" : ""}
      `}
      >
        {/* Mobile Header with Close Button - Fixed at top */}
        {isMobile && (
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div
          className={
            isMobile
              ? "mobile-filters-scroll flex-1 overflow-y-auto pb-4 px-1"
              : "space-y-4 sm:space-y-5"
          }
        >
          {/* Search Input */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Gender Filter */}
          <div className="mb-4 sm:mb-5 border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50">
            <button
              onClick={() => toggleSection("gender")}
              className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Gender
              </span>
              {expandedSections.gender ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.gender && (
              <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 pl-4 sm:pl-6">
                {FIXED_GENDERS.map((gender) => (
                  <div key={gender} className="flex items-center">
                    <input
                      type="radio"
                      id={`gender-${gender}`}
                      name="gender"
                      checked={
                        (gender === "All" && !selectedGender) ||
                        selectedGender === gender
                      }
                      onChange={() =>
                        setSelectedGender(gender === "All" ? "" : gender)
                      }
                      className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`gender-${gender}`}
                      className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="mb-4 sm:mb-5 border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50">
            <button
              onClick={() => toggleSection("brand")}
              className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                Brand
              </span>
              {expandedSections.brand ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.brand && (
              <div className="mt-2 sm:mt-3">
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-2 sm:p-2.5 pl-3 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                  >
                    {FIXED_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="mb-4 sm:mb-5 border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50">
            <button
              onClick={() => toggleSection("price")}
              className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                Price Range
              </span>
              {expandedSections.price ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.price && (
              <div className="mt-2 sm:mt-3">
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-1/2">
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">
                      Min ₹
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice || ""}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="w-full p-1.5 sm:p-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">
                      Max ₹
                    </label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={maxPrice || ""}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="w-full p-1.5 sm:p-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                  Enter amounts in ₹
                </div>
              </div>
            )}
          </div>

          {/* Discount Filter */}
          <div className="mb-4 sm:mb-5 border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50">
            <button
              onClick={() => toggleSection("discount")}
              className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                Discount Range
              </span>
              {expandedSections.discount ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.discount && (
              <div className="mt-2 sm:mt-3">
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-1/2">
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">
                      Min %
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minDiscount || ""}
                      onChange={(e) =>
                        setMinDiscount(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="w-full p-1.5 sm:p-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[10px] sm:text-xs text-gray-500 mb-1">
                      Max %
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={maxDiscount || ""}
                      onChange={(e) =>
                        setMaxDiscount(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="w-full p-1.5 sm:p-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                  0% to 100% discount
                </div>
              </div>
            )}
          </div>

          {/* Sort By */}
          <div className="mb-4 sm:mb-6 border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50">
            <button
              onClick={() => toggleSection("sort")}
              className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
                Sort By
              </span>
              {expandedSections.sort ? (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.sort && (
              <div className="mt-2 sm:mt-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 sm:p-2.5 pl-3 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Default (Recommended)</option>
                    <option value="-created_at">Latest Arrivals</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-discount">Highest Discount</option>
                    <option value="discount">Lowest Discount</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Apply Filters Button - For BOTH mobile and desktop */}
        <div
          className={`
          ${
            isMobile
              ? "sticky bottom-0 bg-white pt-3 pb-1 border-t border-gray-200 mt-2"
              : "mt-6 pt-4 border-t border-gray-200"
          }
        `}
        >
          <button
            onClick={() => {
              applyFilters();
              if (isMobile) {
                setShowMobileFilters(false);
              }
            }}
            className="w-full py-3 mb-16 lg:mb-0 sm:py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Clear Filters link for desktop (optional) */}
          {!isMobile && activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full text-center text-sm text-gray-500 hover:text-blue-600 mt-3 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const initialQ = urlParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedGender, setSelectedGender] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const filtersRef = useRef(null);
  const mainContentRef = useRef(null);
  const mobileFilterButtonRef = useRef(null);

  // Get products from Redux store - FIXED: Using correct selector
  const productsStateRaw = useSelector(
    (state) => state.product?.products ?? state.products?.products ?? [],
  );

  const loadingProducts = useSelector(
    (state) => state.product?.loading ?? state.products?.loading ?? false,
  );

  const searchSliceResults = useSelector(
    (state) => state.search?.results ?? [],
  );
  const searchSliceLoading = useSelector(
    (state) => state.search?.loading ?? false,
  );

  // Normalize products array - handle both array and object with results property
  const normalizeProductsArray = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.results)) return raw.results;
    if (typeof raw === "object" && raw !== null) {
      // Check if it's a single product object
      if (raw.product_uuid) {
        return [raw];
      }
    }
    return [];
  };

  const productsRawArray = normalizeProductsArray(productsStateRaw);

  // Transform products data - FIXED: Always transform regardless of search
  const products = useMemo(() => {
    return productsRawArray.map(transformProductData);
  }, [productsRawArray]);

  const searchArray = Array.isArray(searchSliceResults?.results)
    ? searchSliceResults.results
    : Array.isArray(searchSliceResults)
      ? searchSliceResults
      : [];

  // Display products - FIXED: Always use products array (which gets updated by Redux)
  const displayProducts = useMemo(() => {
    return products;
  }, [products]);

  // Build backend parameters
  const buildBackendParams = () => {
    const params = {};

    if (searchTerm && searchTerm.trim().length > 0) {
      params.search = searchTerm.trim();
    }

    if (selectedGender && selectedGender !== "All") {
      params.gender = selectedGender.toLowerCase();
    }

    if (selectedBrand && selectedBrand !== "All") {
      params.brand = selectedBrand;
    }

    if (minPrice !== "" && minPrice > 0) {
      params.price_min = Number(minPrice);
    }

    if (maxPrice !== "" && maxPrice > 0) {
      params.price_max = Number(maxPrice);
    }

    if (minDiscount !== "" && minDiscount >= 0) {
      params.discount_min = Number(minDiscount);
    }

    if (maxDiscount !== "" && maxDiscount > 0) {
      params.discount_max = Number(maxDiscount);
    }

    if (sortBy) {
      params.ordering = sortBy;
    }

    return params;
  };

  // Apply filters and fetch products
  const handleApplyFilters = () => {
    const params = buildBackendParams();
    console.log("Applying filters with params:", params);
    dispatch(fetchProducts(params));

    // Close mobile filters if open
    if (window.innerWidth < 1024) {
      setShowMobileFilters(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedGender("");
    setSelectedBrand("All");
    setMinPrice("");
    setMaxPrice("");
    setMinDiscount("");
    setMaxDiscount("");
    setSortBy("");

    // Fetch without filters (only search and sort)
    const params = {};
    if (searchTerm && searchTerm.trim().length > 0) {
      params.search = searchTerm.trim();
    }

    console.log("Clearing filters, fetching with params:", params);
    dispatch(fetchProducts(params));

    if (window.innerWidth < 1024) {
      setShowMobileFilters(false);
    }
  };

  // Handle individual filter removal
  const handleRemoveFilter = (filterType) => {
    switch (filterType) {
      case "gender":
        setSelectedGender("");
        break;
      case "brand":
        setSelectedBrand("All");
        break;
      case "minPrice":
        setMinPrice("");
        break;
      case "maxPrice":
        setMaxPrice("");
        break;
      case "minDiscount":
        setMinDiscount("");
        break;
      case "maxDiscount":
        setMaxDiscount("");
        break;
      default:
        break;
    }

    // Re-fetch with updated filters
    const params = buildBackendParams();
    dispatch(fetchProducts(params));
  };

  // Initial load and search term changes
  // Add this useEffect in CategoriesPage component (after other useEffects)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q") || "";

    if (queryParam !== searchTerm) {
      setSearchTerm(queryParam);

      // Fetch products with the new search term
      const fetchParams = {};
      if (queryParam.trim().length > 0) {
        fetchParams.search = queryParam.trim();
      }
      if (sortBy) {
        fetchParams.ordering = sortBy;
      }

      dispatch(fetchProducts(fetchParams));

      // Also update search slice
      if (queryParam.trim().length > 0) {
        dispatch(setSearchQuery(queryParam));
        dispatch(fetchSearchResults(queryParam));
      } else {
        dispatch(setSearchQuery(""));
      }
    }
  }, [location.search, dispatch, sortBy]); // Add sortBy if you want to maintain sort order

  useEffect(() => {
    // Only run this if NOT triggered by URL change
    // Or you could remove it entirely since URL sync handles it
    if (searchTerm && searchTerm.trim().length > 0) {
      dispatch(setSearchQuery(searchTerm));
      dispatch(fetchSearchResults(searchTerm));
    } else {
      dispatch(setSearchQuery(""));
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        e.target !== inputRef.current
      ) {
        setShowSuggestions(false);
      }

      if (
        showMobileFilters &&
        filtersRef.current &&
        !filtersRef.current.contains(e.target) &&
        !e.target.closest(".mobile-filter-toggle") &&
        !mobileFilterButtonRef.current?.contains(e.target) &&
        window.innerWidth < 1024
      ) {
        setShowMobileFilters(false);
      }
    };

    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [showMobileFilters]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (productsRawArray.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [productsRawArray, isInitialLoad]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams(location.search);
    if (searchTerm && searchTerm.trim().length > 0) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true },
    );
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true },
    );
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedGender("");
    setSelectedBrand("All");
    setMinPrice("");
    setMaxPrice("");
    setMinDiscount("");
    setMaxDiscount("");
    setSortBy("-created_at");
    setShowSuggestions(false);
    setShowMobileFilters(false);
    setShowFilters(true);

    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true },
    );

    // Fetch all products
    dispatch(fetchProducts({}));
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return [
      selectedGender && selectedGender !== "All" ? 1 : 0,
      selectedBrand && selectedBrand !== "All" ? 1 : 0,
      minPrice !== "" ? 1 : 0,
      maxPrice !== "" ? 1 : 0,
      minDiscount !== "" ? 1 : 0,
      maxDiscount !== "" ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [
    selectedGender,
    selectedBrand,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
  ]);

  const filteredProductsCount = displayProducts.length;
  const isLoading =
    loadingProducts || (searchTerm && searchSliceLoading) || isInitialLoad;

  return (
    <>
      <style>{`
  @keyframes placeholderFade {
    0% { opacity: 0; transform: translateY(-5px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(5px); }
  }
  .placeholder-animate::placeholder {
    animation: placeholderFade 3s ease-in-out;
  }
  
  .decathlon-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
  }
  .decathlon-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .decathlon-scrollbar::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 10px;
  }
  .decathlon-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 10px;
    border: 2px solid #f3f4f6;
  }
  
  /* Mobile Filters Overlay */
  .mobile-filters-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
    display: none;
  }
  .mobile-filters-overlay.active {
    display: block;
  }
  
  /* Mobile Filters Sidebar - UPDATED for proper scrolling */
  .mobile-filters-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 90%;
    max-width: 380px;
    background: white;
    z-index: 50;
    overflow: hidden; /* Changed from overflow-y: auto to hidden */
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
  }
  .mobile-filters-sidebar.active {
    transform: translateX(0);
  }
  
  /* Scrollable content area inside mobile filters */
  .mobile-filters-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 12px 12px 12px;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
  
  .mobile-filters-scroll::-webkit-scrollbar {
    width: 4px;
  }
  
  .mobile-filters-scroll::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
  }
  
  .mobile-filters-scroll::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 8px;
  }
  
  /* Fixed header in mobile filters */
  .mobile-filters-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    padding: 16px 16px 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  /* Fixed footer in mobile filters */
  .mobile-filters-footer {
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 10;
    padding: 12px 16px 16px 16px;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  @media (min-width: 1024px) {
    .mobile-filters-overlay,
    .mobile-filters-sidebar {
      display: none !important;
    }
  }
  
  /* Custom skeleton animation */
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  /* Mobile filter button styles */
  .mobile-filter-toggle {
    position: relative;
  }
  
  .filter-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
  }
  
  /* Animation for filter sections */
  .filter-section-enter {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.2s ease;
  }
  
  .filter-section-enter-active {
    max-height: 300px;
    opacity: 1;
  }
  
  .filter-section-exit {
    max-height: 300px;
    opacity: 1;
  }
  
  .filter-section-exit-active {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.2s ease;
  }
  
  /* Touch-friendly input styles for mobile */
  @media (max-width: 640px) {
    input, select, button {
      font-size: 16px !important; /* Prevents zoom on iOS */
    }
    
    .mobile-filters-sidebar {
      width: 100%;
      max-width: 100%;
    }
  }
  
  /* Debug styles - can be removed */
  .debug-border {
    border: 1px solid red;
  }
  .debug-bg {
    background-color: rgba(255, 0, 0, 0.1);
  }
`}</style>

      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        {/* Mobile Filters Overlay */}
        <div
          className={`mobile-filters-overlay ${showMobileFilters ? "active" : ""}`}
          onClick={() => setShowMobileFilters(false)}
        />

        {/* Mobile Filters Sidebar */}
        <div
          ref={filtersRef}
          className={`mobile-filters-sidebar ${showMobileFilters ? "active" : ""} decathlon-scrollbar`}
        >
          <FilterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minDiscount={minDiscount}
            setMinDiscount={setMinDiscount}
            maxDiscount={maxDiscount}
            setMaxDiscount={setMaxDiscount}
            sortBy={sortBy}
            setSortBy={setSortBy}
            applyFilters={handleApplyFilters}
            clearFilters={handleClearFilters}
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
            activeFiltersCount={activeFiltersCount}
            isMobile={true}
          />
        </div>

        {/* Main Content Area */}
        <div ref={mainContentRef} className="flex-1 pb-24">
          <div className="mx-auto px-2 sm:px-3 lg:px-4 py-3 sm:py-4 md:py-6">
            {/* Page Title and Info */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 md:mb-2">
                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : "All Products"}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                {filteredProductsCount}{" "}
                {filteredProductsCount === 1 ? "product" : "products"} found
              </p>
            </div>

            {/* Prominent Search Bar */}
            <div className="mb-4 sm:mb-6">
              <SearchBar
                initialValue={searchTerm}
                onSubmit={(value) => {
                  setSearchTerm(value);
                  handleSearchSubmit();
                }}
                onClear={handleClearSearch}
                placeholder="What are you looking for today?"
              />
            </div>

            {/* Mobile Filter Bar - NEW */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <button
                ref={mobileFilterButtonRef}
                onClick={toggleMobileFilters}
                className="mobile-filter-toggle flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Mobile Sort Dropdown */}
              <div className="relative flex-1 max-w-[180px] ml-3">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    const params = buildBackendParams();
                    params.ordering = e.target.value;
                    dispatch(fetchProducts(params));
                  }}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="-created_at">Latest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-discount">Highest Discount</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
              {/* Desktop Filters */}
              <div
                className={`${showMobileFilters ? "block" : "hidden"} lg:block lg:w-72 flex-shrink-0`}
              >
                <FilterSection
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  selectedGender={selectedGender}
                  setSelectedGender={setSelectedGender}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  minDiscount={minDiscount}
                  setMinDiscount={setMinDiscount}
                  maxDiscount={maxDiscount}
                  setMaxDiscount={setMaxDiscount}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  applyFilters={handleApplyFilters}
                  clearFilters={handleClearFilters}
                  showMobileFilters={showMobileFilters}
                  setShowMobileFilters={setShowMobileFilters}
                  activeFiltersCount={activeFiltersCount}
                  isMobile={false}
                />
              </div>

              {/* Products Grid Area */}
              <div className="flex-1">
                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <button
                      onClick={toggleFilters}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600 hidden sm:inline">
                          Active filters:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedGender && selectedGender !== "All" && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full">
                              {selectedGender}
                              <button
                                onClick={() => handleRemoveFilter("gender")}
                                className="hover:text-blue-900 text-xs"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {selectedBrand !== "All" && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full">
                              {selectedBrand}
                              <button
                                onClick={() => handleRemoveFilter("brand")}
                                className="hover:text-blue-900 text-xs"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {minPrice && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full">
                              Min ₹{minPrice}
                              <button
                                onClick={() => handleRemoveFilter("minPrice")}
                                className="hover:text-blue-900 text-xs"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {maxPrice && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full">
                              Max ₹{maxPrice}
                              <button
                                onClick={() => handleRemoveFilter("maxPrice")}
                                className="hover:text-blue-900 text-xs"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {minDiscount && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full">
                              Min {minDiscount}% off
                              <button
                                onClick={() =>
                                  handleRemoveFilter("minDiscount")
                                }
                                className="hover:text-blue-900 text-xs"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {maxDiscount && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 sm:px-3 py-1 rounded-full">
                              Max {maxDiscount}% off
                              <button
                                onClick={() =>
                                  handleRemoveFilter("maxDiscount")
                                }
                                className="hover:text-blue-900 text-xs"
                              >
                                ×
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-sm text-gray-600 hidden sm:inline">
                      {filteredProductsCount} products
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        // Re-fetch with new sort order
                        const params = buildBackendParams();
                        params.ordering = e.target.value;
                        dispatch(fetchProducts(params));
                      }}
                      className="border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Default (Recommended)</option>
                      <option value="-created_at">Latest Arrivals</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="-discount">Highest Discount</option>
                      <option value="discount">Lowest Discount</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                  <ProductGridSkeleton count={8} />
                ) : displayProducts.length === 0 ? (
                  <div className="text-center py-8 sm:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-gray-300">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
                      Try adjusting your filters or search terms to find what
                      you're looking for.
                    </p>
                    <button
                      onClick={resetAllFilters}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {displayProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 h-full"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
