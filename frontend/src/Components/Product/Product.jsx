import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "./productslice";
import {
  fetchHomepageLevels,
  selectHomepageLevels,
  selectHomepageLoading,
  selectHomepageError,
} from "../Home/HomePageSlice";
import { 
  Filter, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  Users, 
  Tag, 
  IndianRupee, 
  Percent, 
  ArrowUpDown 
} from "lucide-react";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";

// Product Card
function ProductCard({ product }) {
  const navigate = useNavigate();
  const rating = product.average_rating || 4.5;

  return (
    <Link
      to={`/ProductInfo/${product.product_uuid || product.id}/${product.title}`}
      className="block h-full"
    >
      <div className="relative h-full bg-white overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col rounded-xl hover:-translate-y-1 active:translate-y-0">
        {/* Image Container */}
        <div className="relative w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group">
          {product.isFeatured && (
            <div className="absolute top-2 left-2 z-20">
              <div className="relative overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold rounded-full shadow-lg flex items-center transition-all duration-300 group-hover/featured:pr-3">
                  {/* Star Icon Container */}
                  <div className="p-1.5 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>

                  {/* Featured Text with sliding effect */}
                  <span className="absolute left-8 opacity-0 -translate-x-2 group-hover/featured:opacity-100 group-hover/featured:translate-x-0 transition-all duration-300 whitespace-nowrap">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Primary Image */}
          <img
            src={product.img}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
            loading="lazy"
          />

          {/* Secondary Image (on hover) */}
          {product.img2 && (
            <img
              src={product.img2}
              alt={`${product.title} Hover`}
              className="absolute inset-0 w-full h-full object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
            />
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900 px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
              Quick View
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-900 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
              <svg
                className="w-3 h-3 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>
                {typeof rating === "number" ? rating.toFixed(1) : "4.5"}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-grow p-4 pt-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1 text-sm md:text-base leading-tight min-h-[2.3rem]">
            {product.title}
          </h3>

          {/* Price Section */}
          <div className="mt-auto pt-1 md:pt-3">
            <div className="vlock gap-2 ">
              <p className="text-base md:text-xl font-bold text-gray-900">
                ₹{product.price}
              </p>

              {/* Discount Section */}
              {(product.original || product.discount) && (
                <div className="flex items-center gap-2">
                  {product.original && (
                    <p className="text-sm text-gray-500 line-through">
                      {product.original}
                    </p>
                  )}
                  {product.discount && (
                    <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="mx-2 mb-4 mt-auto py-2.5 text-sm font-bold uppercase border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-colors duration-200 rounded-lg flex items-center justify-center gap-2 group/btn"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/ProductInfo/${product.product_uuid || product.id}`);
          }}
        >
          <svg
            className="w-4 h-4 text-gray-700 group-hover/btn:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

// Skeleton components
function SkeletonProductCard() {
  return (
    <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 flex flex-col rounded-lg animate-pulse">
      <div className="w-full h-46 md:h-54 lg:h-70 bg-gray-300 flex items-center justify-center">
        <div className="w-full h-full bg-gray-300"></div>
      </div>
      <div className="relative bottom-11 left-2">
        <div className="flex p-2 text-sm font-semibold bg-gray-300 w-16 h-6 rounded"></div>
      </div>
      <div className="mt-[-22px] px-4 text-start flex flex-col flex-grow min-h-[120px] space-y-2 py-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      <div className="w-[95%] mx-auto py-2 my-2 bg-gray-300 rounded h-10"></div>
    </div>
  );
}

function SkeletonBanner() {
  return (
    <div className="mb-10 animate-pulse">
      <div className="w-full h-64 bg-gray-300 rounded-xl"></div>
    </div>
  );
}

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

// Filter Section Component
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

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center font-medium shadow-sm"
        >
          <Filter className="w-4 h-4" />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
          {activeFiltersCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Container */}
      <div
        className={`
        ${showMobileFilters ? "block" : "hidden"} 
        lg:block w-full lg:w-72 bg-white p-5 rounded-xl border border-gray-200 h-fit sticky top-24 shadow-sm
      `}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors px-2 py-1 rounded hover:bg-blue-50"
          >
            Clear All
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
            />
          </div>
        </div>

        {/* Gender Filter */}
        <div className="mb-5 border border-gray-100 rounded-lg p-3 bg-gray-50">
          <button
            onClick={() => toggleSection("gender")}
            className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gender
            </span>
            {expandedSections.gender ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.gender && (
            <div className="mt-3 space-y-2 pl-6">
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`gender-${gender}`}
                    className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    {gender}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div className="mb-5 border border-gray-100 rounded-lg p-3 bg-gray-50">
          <button
            onClick={() => toggleSection("brand")}
            className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Brand
            </span>
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.brand && (
            <div className="mt-3">
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2.5 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                >
                  {FIXED_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-5 border border-gray-100 rounded-lg p-3 bg-gray-50">
          <button
            onClick={() => toggleSection("price")}
            className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Price Range
            </span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="mt-3">
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">Min ₹</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice || ""}
                    onChange={(e) =>
                      setMinPrice(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">Max ₹</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={maxPrice || ""}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Enter amounts in ₹
              </div>
            </div>
          )}
        </div>

        {/* Discount Filter */}
        <div className="mb-5 border border-gray-100 rounded-lg p-3 bg-gray-50">
          <button
            onClick={() => toggleSection("discount")}
            className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Discount Range
            </span>
            {expandedSections.discount ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.discount && (
            <div className="mt-3">
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">Min %</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minDiscount || ""}
                    onChange={(e) =>
                      setMinDiscount(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">Max %</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={maxDiscount || ""}
                    onChange={(e) =>
                      setMaxDiscount(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                0% to 100% discount
              </div>
            </div>
          )}
        </div>

        {/* Sort By */}
        <div className="mb-6 border border-gray-100 rounded-lg p-3 bg-gray-50">
          <button
            onClick={() => toggleSection("sort")}
            className="flex justify-between items-center w-full font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort By
            </span>
            {expandedSections.sort ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.sort && (
            <div className="mt-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2.5 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="">Default (Recommended)</option>
                  <option value="-created_at">Latest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-discount">Highest Discount</option>
                  <option value="discount">Lowest Discount</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="w-full py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-200 transition-colors font-semibold shadow-sm hover:shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}

// Fallback banners
const fallbackBanners = {
  men: [
    {
      id: "men-banner-1",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    },
  ],
  women: [
    {
      id: "women-banner-1",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80",
    },
  ],
  kids: [
    {
      id: "kids-banner-1",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1600&q=80",
    },
  ],
  all: [
    {
      id: "all-banner-1",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80",
    },
  ],
};

// Subcategories
const CATEGORY_NAMES = {
  // Main Categories from Navbar
  "CAT-G26TA0JEUVF5": "Men Collection",
  "CAT-QOJW1SDRVIGY": "Women Collection",
  "CAT-RTI4IJ9LKU8F": "Kids Collection",
  "CAT-C0OUXUVW38DB": "Swimwear",
  "CAT-UPUTV2I0NIT5": "Accessories",

  // Men Subcategories
  "CAT-63P62E7YP6BB": "Compression T-Shirt",
  "CAT-C3GRNQWCNKA7": "Shorts",
  "CAT-1UTP51L84792": "Sports Tighty",
  "CAT-BHGG4D2IZZIV": "Cargo's",
  "CAT-ADPY9IFUODKW": "Cargo Short",
  "CAT-KAYT1FWPCT2B": "Half T-shirt",
  "CAT-0JJI7IIP9CV3": "Full T-shirt",
  "CAT-VZ3ZOFGITRRH": "Jacket's",
  "CAT-MJPXIQRXWYJY": "Winter Jacket's",
  "CAT-IOAIRU2GGCF4": "Leggings",
  "CAT-FGEUD3HYZUQF": "Lower's",
  "CAT-8G29OIU5VBF9": "Track Suit",
  "CAT-9LI3ANQJ1FV7": "Stringer's / Vest",
  "CAT-I7FYVV0UXDGE": "Swimwear",
  "CAT-WKJ0SN2EABAI": "Combos",

  // Women Subcategories
  "CAT-QRPXX26LXJOP": "Compression T-shirt",
  "CAT-GLLK5DUNE7AK": "Gym T-shirt",
  "CAT-469CHDFRH147": "Women T-shirt",
  "CAT-9XEHNOGW5XCB": "Running short's",
  "CAT-Z0BMMQRLFT03": "Short's",
  "CAT-QBM3B4KALKF6": "Tight's",
  "CAT-PAMN7PVISIRW": "Sport's Top",
  "CAT-9WU82B5KW24Y": "Sports's Bra",
  "CAT-ZPP2BLSQA48P": "Legging's",
  "CAT-31GDGDENTR7K": "Crop-Top",
  "CAT-QMLDOG5J6JKD": "Capri",
  "CAT-PL20MJX82VK8": "Sleeve Less",
  "CAT-EE1J43PPZUKQ": "Combos",
  "CAT-MKBLMJFYOT51": "Compression Set's",
  "CAT-I802T5TYP8ML": "Coat Set",
  "CAT-MI3DM18IX5YQ": "Swimwear",
  "CAT-VKZ9FPEB6XTO": "Yoga Pant",

  // Kids Subcategories
  "CAT-WO62HVKJ5USA": "Jersey",
  "CAT-9V236XB6VM1W": "Full T-shirt's",
  "CAT-8GOHY0HTCOWV": "Half T-shirt's",
  "CAT-0T7FYKOOM2WJ": "Short's",
  "CAT-P18VCRU4PXP7": "Sports's Pants",
  "CAT-M71Z74YXATNL": "Swimwear",
  "CAT-XMCBXZKLFZFF": "Jackets",

  // Accessories Subcategories
  "CAT-TDRGY09FOVM4": "Gym Bags",
  "CAT-JTWBUAA5A7OT": "Bottle's",
  "CAT-X6L9FZITNTFL": "Gym Glove's",
  "CAT-YY1MW3URC7WU": "Stocking's",
  "CAT-MCJ2A5RZVK2G": "Wrist Band",
  "CAT-UXXTGG8522Z8": "Wrist Supporter",
  "CAT-X607UOVHXAED": "Supporter",
  "CAT-4QZKESQRELPB": "Arm Sleeves",
  "CAT-83KI0SO11FJW": "Arm Pad",
  "CAT-2NEZWU2Z6ESY": "Knee Pad",
  "CAT-C00MLLSHHUFV": "Calf",
  "CAT-AX02EVOVSZS2": "Head Band",
  "CAT-IARQY8MASP5G": "Knee Cap",
  "CAT-BQGQHBKFHQQQ": "Healmet Cap",
  "CAT-KUYNOJ0TM56D": "Gym Belt",
  "CAT-3L49JAJWSOM5": "Skating Suit",

  // Swimwear Subcategories
  "CAT-IYOADXPI6562": "Swim Suit's",
  "CAT-44SGE4W7RAOW": "Shorts",
  "CAT-FT5L89R3DUDQ": "Swim Tight's",
  "CAT-SFCF5GQS8X8D": "Swim T-shirt's",
  "CAT-HDCF4HXFOV4G": "Swim Frock",
  "CAT-081S1LBN84ZW": "Beach Wear",
  "CAT-ZCU8RZWX9655": "Swimming Trunk",
};

function Product() {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract category UUID
  const categoryUuid = useMemo(() => {
    // Try different parameter names
    if (params.categoryUUID) {
      return params.categoryUUID;
    }

    if (params["Cat-UUID"]) {
      return params["Cat-UUID"];
    }

    if (params.catUUID) {
      return params.catUUID;
    }

    // Check path segments
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    if (pathSegments[0] === "product" && pathSegments[1]) {
      return pathSegments[1];
    }

    return null;
  }, [params, location]);

  // Use correct selectors for products fetched by fetchProducts
  const productsState = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const homepageData = useSelector(selectHomepageLevels);
  const homepageLoading = useSelector(selectHomepageLoading);
  const homepageError = useSelector(selectHomepageError);

  // Filter states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedGender, setSelectedGender] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return [
      searchTerm ? 1 : 0,
      selectedGender && selectedGender !== "All" ? 1 : 0,
      selectedBrand && selectedBrand !== "All" ? 1 : 0,
      minPrice !== "" ? 1 : 0,
      maxPrice !== "" ? 1 : 0,
      minDiscount !== "" ? 1 : 0,
      maxDiscount !== "" ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [
    searchTerm,
    selectedGender,
    selectedBrand,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
  ]);

  // Unified function to fetch products
  const fetchProductsData = useMemo(() => {
    return async (customFilters = {}) => {
      try {
        const params = { ...customFilters };

        // Add category UUID if available
        if (categoryUuid) {
          params.category = categoryUuid;
        }

        // Add UI filters
        if (searchTerm && !customFilters.search) {
          params.search = searchTerm;
        }
        if (
          selectedGender &&
          selectedGender !== "All" &&
          !customFilters.gender
        ) {
          params.gender = selectedGender.toLowerCase();
        }
        if (selectedBrand && selectedBrand !== "All" && !customFilters.brand) {
          params.brand = selectedBrand;
        }
        if (minPrice !== "" && minPrice > 0 && !customFilters.price_min) {
          params.price_min = minPrice;
        }
        if (maxPrice !== "" && maxPrice > 0 && !customFilters.price_max) {
          params.price_max = maxPrice;
        }
        if (
          minDiscount !== "" &&
          minDiscount >= 0 &&
          !customFilters.discount_min
        ) {
          params.discount_min = minDiscount;
        }
        if (
          maxDiscount !== "" &&
          maxDiscount > 0 &&
          !customFilters.discount_max
        ) {
          params.discount_max = maxDiscount;
        }
        if (sortBy && !customFilters.ordering) {
          params.ordering = sortBy;
        }

        const result = await dispatch(fetchProducts(params));

        if (result.error) {
          console.error("Error fetching products:", result.error);
        } else {
          setHasFetched(true);
        }

        return result;
      } catch (error) {
        console.error("Exception during fetch:", error);
        return { error: error.message };
      }
    };
  }, [
    dispatch,
    categoryUuid,
    searchTerm,
    selectedGender,
    selectedBrand,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    sortBy,
  ]);

  // Apply filters
  const applyFilters = () => {
    fetchProductsData();
    setShowMobileFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setSelectedGender("");
    setMinPrice("");
    setMaxPrice("");
    setMinDiscount("");
    setMaxDiscount("");
    setSortBy("");

    fetchProductsData({});
  };

  // Fetch products when component mounts or categoryUuid changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchProductsData();
      await dispatch(fetchHomepageLevels());
    };

    fetchData();
  }, [dispatch, categoryUuid]);

  // Transform products data
  const products = useMemo(() => {
    let productsArray = [];

    // Check if it's an object with 'results' property (paginated response)
    if (productsState && typeof productsState === "object") {
      if (productsState.results && Array.isArray(productsState.results)) {
        productsArray = productsState.results;
      }
      // Check if it's already an array of products
      else if (Array.isArray(productsState)) {
        productsArray = productsState;
      }
      // Check if it's an object that can be transformed directly
      else if (productsState.product_uuid) {
        productsArray = [productsState];
      }
    }

    // Transform each product
    const transformed = productsArray.map((product) => {
      return {
        id: product.product_uuid || product.id,
        product_uuid: product.product_uuid,
        title: product.title || product.name,
        price: product.price,
        original: product.original || "",
        discount: product.discount || "",
        brand: product.brand?.name || product.brand || "",
        category: product.category?.name || "Uncategorized",
        img: product.img || "",
        img2: product.img2 || "",
        average_rating: product.average_rating || 4.5,
        isFeatured: product.is_featured || false,
      };
    });

    return transformed;
  }, [productsState]);

  // Get appropriate banner based on category
  const getCategoryBannerItems = () => {
    if (homepageLoading) {
      return [];
    }

    if (!homepageData || homepageData.length === 0) {
      const categoryName = CATEGORY_NAMES[categoryUuid];
      if (categoryName?.includes("Men")) return fallbackBanners.men;
      if (categoryName?.includes("Women")) return fallbackBanners.women;
      if (categoryName?.includes("Kids")) return fallbackBanners.kids;
      return fallbackBanners.all;
    }

    const productLevel = homepageData.find((lvl) =>
      lvl.name?.toLowerCase().includes("product section"),
    );

    if (!productLevel || !productLevel.sections) {
      const categoryName = CATEGORY_NAMES[categoryUuid];
      if (categoryName?.includes("Men")) return fallbackBanners.men;
      if (categoryName?.includes("Women")) return fallbackBanners.women;
      if (categoryName?.includes("Kids")) return fallbackBanners.kids;
      return fallbackBanners.all;
    }

    const categoryName = CATEGORY_NAMES[categoryUuid];
    let matchedSection = null;

    if (categoryName) {
      matchedSection = productLevel.sections.find((sec) =>
        sec.title?.toLowerCase().includes(categoryName.toLowerCase()),
      );
    }

    if (!matchedSection) {
      const allItems = productLevel.sections.flatMap((sec) => sec.items || []);
      return allItems.length > 0 ? allItems : fallbackBanners.all;
    }

    return matchedSection.items || [];
  };

  const bannerItems = getCategoryBannerItems();

  // Generate page title based on category UUID
  const getPageTitle = () => {
    const categoryName = CATEGORY_NAMES[categoryUuid];
    if (categoryName) return categoryName.toUpperCase();
    return "ALL PRODUCTS";
  };

  // Show error state with retry button
  if (error && !hasFetched) {
    return (
      <div className="mx-auto mt-10 px-4 sm:px-8 md:px-12 lg:px-16 pb-16 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-red-500 text-xl font-bold mb-4">
            ❌ Error Loading Products
          </div>
          <div className="text-gray-600 mb-6 text-center max-w-md">{error}</div>
          <div className="flex gap-4">
            <button
              onClick={() => fetchProductsData({})}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Retry Loading Products
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 px-4 sm:px-8 md:px-12 lg:px-16 pb-16 bg-gray-50">
      {/* Skeleton Banner or Actual Banner */}
      {homepageLoading ? (
        <SkeletonBanner />
      ) : (
        bannerItems &&
        bannerItems.length > 0 && (
          <div className="mb-10">
            <LandscapeCarousel
              items={bannerItems.map((i) => ({
                id: i.item_uuid || i.id,
                image: i.media?.[0]?.image || i.image,
              }))}
            />
          </div>
        )
      )}

      {/* Header with dynamic title */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
          {CATEGORY_NAMES[categoryUuid] && (
            <p className="text-gray-600 mt-1">{CATEGORY_NAMES[categoryUuid]}</p>
          )}
          {!loading && products.length > 0 && (
            <p className="text-gray-600 mt-2">
              Showing {products.length} products
            </p>
          )}
        </div>

        <button
          onClick={() => fetchProductsData({})}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
          title="Refresh products"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-10 relative">
        {/* Left Sidebar - Filters */}
        <div className="lg:w-64 flex-shrink-0">
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
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        {/* Right Content - Products */}
        <div className="flex-1">
          {/* Active Filters Display */}

          {/* Skeleton Product Grid or Actual Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    No products found{" "}
                    {CATEGORY_NAMES[categoryUuid]
                      ? `in ${CATEGORY_NAMES[categoryUuid]}`
                      : ""}
                    .
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Try changing your filters or check back later.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
export { ProductCard };
