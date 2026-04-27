import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../Brands/brandlistslice";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
} from "../Product/productslice";
import { ProductCard } from "../Product/Product";
import { Star, Grid2x2 as Grid, List } from "lucide-react";
import RecommendedProducts from "../Home/RecommendedProducts";

const BrandPage = () => {
  const { brandName } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const { brands, loading: brandsLoading } = useSelector(
    (state) => state.brandlist
  );
  const products = useSelector(selectAllProducts);
  
  const productsLoading = useSelector(selectProductsLoading);

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");

  const transformProductData = (p) => ({
  id: p.product_uuid,
  title: p.name,
  price: `${p.price}`,
  original: p.original,
  discount: p.discount,
  brand: p.brand?.name,
  category: p.category?.name,
  img: p.img,
    
  img2: p.img2,
    
  isFeatured: p.is_featured,
});

  // Fetch data
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Find brand
  const currentBrand = brands.find(
    (b) => b.name?.toLowerCase() === brandName?.toLowerCase()
  );

  // Filter products by brand
  const brandProducts = products.filter(
    (p) => p.brand?.name?.toLowerCase() === brandName?.toLowerCase()
  );

  // Loading
  if (brandsLoading || productsLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  // Brand not found
  if (!currentBrand)
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-3 text-gray-900">
          Brand Not Found
        </h2>
        <p className="text-gray-600">
          The brand you’re looking for doesn’t exist or is inactive.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* 🟦 Brand Header */}
      <div className="relative">
        <div
          className="mx-5 lg:mx-10 h-56 sm:h-64 md:h-72 lg:h-80 bg-contain bg-center relative rounded-b-3xl overflow-hidden"
          style={{
            backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuZBKJDcVB_LAFEXkg8S2coaxkUIJI9BTZVA&s")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="relative z-10 h-full flex items-end">
            <div className="w-full px-6 pb-8">
              <div className="flex items-end gap-6 max-w-6xl mx-auto">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl p-3 shadow-lg flex-shrink-0 border border-gray-200">
                  <img
                    src={currentBrand.logo}
                    alt={currentBrand.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-white flex-1">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
                    {currentBrand.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                    <div className="flex items-center gap-1 bg-blue-600/80 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">4.5</span>
                    </div>
                    <div className="bg-blue-500/80 px-3 py-1.5 rounded-full">
                      <span className="font-medium">
                        {brandProducts.length} Products
                      </span>
                    </div>
                    <div className="bg-blue-500/80 px-3 py-1.5 rounded-full">
                      <span>Active Brand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🖤 Brand Description */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3">
            {currentBrand.description || "No description available."}
          </p>
        </div>

        {/* 💠 Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-10 mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          
        </div>
        {/* 🛒 Product Grid */}
        <div
          className={`grid gap-5 ${
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {brandProducts.length > 0 ? (
            brandProducts.map((product) => {
              const formated = transformProductData(product)
              return <ProductCard key={product.product_uuid} product={formated} />
})
          ) : (
            <p className="text-gray-600 col-span-full text-center py-12 text-lg">
              No products available for this brand.
            </p>
          )}
        </div>

        {/* 🔹 Recommended Section */}
        <div className="mt-16 w-full">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 text-center">
            You Might Also Like
          </h2>
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
