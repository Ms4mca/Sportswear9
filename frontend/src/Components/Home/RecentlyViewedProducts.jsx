import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentlyViewed } from "../Profile/Profileslice";
import { ProductCard } from "../Product/Product";
import { Clock, Trash2 } from "lucide-react";

const formatViewedTime = (viewedAt) => {
  if (!viewedAt) return "Unknown";

  const date = new Date(viewedAt);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

function RecentlyViewedProducts() {
  const dispatch = useDispatch();
  const { recentlyViewed, loadingRecentlyViewed } = useSelector(
    (state) => state.profile
  );
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    dispatch(fetchRecentlyViewed());
  }, [dispatch]);

  const sortedProducts = React.useMemo(() => {
    if (!Array.isArray(recentlyViewed)) return [];

    const items = [...recentlyViewed];
    if (sortBy === "recent") {
      return items.sort(
        (a, b) =>
          new Date(b.viewed_at || 0) - new Date(a.viewed_at || 0)
      );
    } else if (sortBy === "alphabetical") {
      return items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "price-low") {
      return items.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      return items.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return items;
  }, [recentlyViewed, sortBy]);

  if (loadingRecentlyViewed) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
          <p className="text-gray-600 text-sm mt-1">
            {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""} viewed
          </p>
        </div>

        {sortedProducts.length > 0 && (
          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {sortedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                {product.viewed_at && (
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-gray-600 flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3" />
                    {formatViewedTime(product.viewed_at)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Recently Viewed Products
          </h3>
          <p className="text-gray-500 mb-6">
            Products you view will appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default RecentlyViewedProducts;
