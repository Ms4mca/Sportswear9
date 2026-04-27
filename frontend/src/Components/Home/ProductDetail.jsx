import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../Cart/Cartslice";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";
import BASE_URL from "../../store/Baseurl";
import ProductGallery from "../Product/ProductGallery";

export default function ProductDetail({ product: propProduct, flip = false }) {
  const productId = propProduct?.product_uuid || propProduct?.id;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        console.error("No product ID provided");
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching product ${productId}`);
        const response = await axios.get(
          `${BASE_URL}/api/products/${productId}/`
        );
        setProductData(response.data);
        console.log(`Fetched product ${productId}:`, response.data.name || response.data.title);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product details");
        console.error(`Error fetching product ${productId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {};
  }, [productId]);

  const processedProduct = useMemo(() => {
    if (productData) {
      const title = productData.name || productData.title || "Product";
      
      let price = productData.net || productData.price || 0;
      let original = productData.price || productData.original || 0;
      let discount = productData.disc || productData.discount || 0;

      price = typeof price === "string"
        ? parseFloat(price.replace("₹", "").replace(/,/g, "")) || 0
        : Number(price) || 0;
      original = typeof original === "string"
        ? parseFloat(original.replace("₹", "").replace(/,/g, "")) || 0
        : Number(original) || 0;

      if (!discount && original > price && original > 0) {
        discount = Math.round(((original - price) / original) * 100);
      }

      let images = [];
      
      if (Array.isArray(productData.default_images) && productData.default_images.length > 0) {
        images = productData.default_images.map(img => img.url);
      }
      
      if (images.length === 0 && Array.isArray(productData.variants)) {
        const imgs = [];
        productData.variants.forEach((variant) => {
          if (Array.isArray(variant.images)) {
            variant.images.forEach((img) => {
              if (img.url && !imgs.includes(img.url)) {
                imgs.push(img.url);
              }
            });
          }
        });
        images = imgs;
      }
      
      if (images.length === 0 && propProduct) {
        images = [propProduct.img, propProduct.img2].filter(Boolean);
      }

      const brandLogo = productData.brand?.logo || null;

      return {
        ...productData,
        title,
        price,
        original,
        discount: discount ? `${discount}% OFF` : null,
        images,
        product_uuid: productData.product_uuid,
        variants: Array.isArray(productData.variants) ? productData.variants : [],
        brandLogo,
      };
    }
    
    if (propProduct) {
      return {
        title: propProduct.title || propProduct.name || "Product",
        price: propProduct.price || 0,
        original: propProduct.original || propProduct.price || 0,
        discount: propProduct.discount || null,
        images: [propProduct.img, propProduct.img2].filter(Boolean),
        product_uuid: propProduct.product_uuid || propProduct.id,
        variants: propProduct.variants || [],
        sizes: propProduct.sizes || [],
        brandLogo: propProduct.brandLogo || null,
      };
    }

    return null;
  }, [productData, propProduct]);

  const colorsList = useMemo(() => {
    if (!processedProduct) {
      return [];
    }

    if (Array.isArray(processedProduct.variants) && processedProduct.variants.length > 0) {
      const colors = [];
      
      processedProduct.variants.forEach((variant, index) => {
        const colorName = variant.color || variant.color_name || `Color ${index + 1}`;
        const colorId = variant.color_id || variant.color_code || colorName;
        const colorCode = variant.color_code || variant.hex_code || "#ccc";

        const availableSizes = Array.isArray(variant.sizes) 
          ? variant.sizes
              .filter((size) => size.is_available !== false && (size.stock_quantity || 0) > 0)
              .map((size) => ({
                value: size.value || size.size || "One Size",
                variant_id: size.variant_id || size.id || `${productId}_${colorId}_${size.value}`,
                stock_quantity: size.stock_quantity || size.quantity || 10,
                price: size.price || variant.price || processedProduct.price,
              }))
          : [];

        if (availableSizes.length > 0) {
          colors.push({
            key: colorId,
            name: colorName,
            hex: colorCode,
            images: Array.isArray(variant.images) ? variant.images.map(img => img.url) : [],
            sizes: availableSizes,
            variant: variant,
          });
        }
      });

      return colors;
    }
    
    if (processedProduct.sizes && processedProduct.sizes.length > 0) {
      return [{
        key: 'default',
        name: 'Default',
        hex: '#ccc',
        images: processedProduct.images || [],
        sizes: processedProduct.sizes.map(size => ({
          value: size,
          variant_id: `${productId}_${size}`,
          stock_quantity: 10,
          price: processedProduct.price,
        })),
      }];
    }
    
    return [];
  }, [processedProduct, productId]);

  const selectedColorObj = useMemo(() => {
    if (!selectedColor) return null;
    return colorsList.find((c) => c.key === selectedColor) || null;
  }, [colorsList, selectedColor]);

  const allAvailableSizes = useMemo(() => {
    if (!colorsList.length) return [];
    
    const sizesSet = new Set();
    colorsList.forEach((color) => {
      color.sizes.forEach((size) => {
        if (size.value) {
          sizesSet.add(size.value);
        }
      });
    });
    
    return Array.from(sizesSet);
  }, [colorsList]);

  useEffect(() => {
    if (colorsList.length > 0) {
      const firstAvailableColor = colorsList[0];
      setSelectedColor(firstAvailableColor.key);

      if (firstAvailableColor.sizes.length > 0) {
        setSelectedSize(firstAvailableColor.sizes[0].value);
      }
    }
  }, [colorsList]);

  const handleAddToCart = useCallback(() => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    if (!processedProduct || !selectedColorObj || !selectedSize) {
      const event = new CustomEvent("showToast", {
        detail: {
          message: "❌ Please select color and size",
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    const selectedVariant = selectedColorObj.sizes.find(
      (size) => size.value === selectedSize
    );

    if (!selectedVariant) {
      const event = new CustomEvent("showToast", {
        detail: {
          message: "❌ Selected size is not available",
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    if (selectedVariant.stock_quantity < quantity) {
      const event = new CustomEvent("showToast", {
        detail: {
          message: `❌ Only ${selectedVariant.stock_quantity} items available in stock`,
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    const payload = {
      product_uuid: processedProduct.product_uuid,
      variant_id: selectedVariant.variant_id,
      color_id: selectedColorObj.key,
      quantity: quantity,
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        const event = new CustomEvent("showToast", {
          detail: {
            message: "✅ Added to cart successfully!",
            type: "success",
          },
        });
        window.dispatchEvent(event);
        navigate('/cart');
      })
      .catch((err) => {
        console.error(err);
        const event = new CustomEvent("showToast", {
          detail: {
            message: "❌ Failed to add item to cart",
            type: "error",
          },
        });
        window.dispatchEvent(event);
      });
  }, [processedProduct, selectedColorObj, selectedSize, quantity, dispatch, navigate, isAuthenticated]);

  const handleBuyNow = useCallback(() => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    
    handleAddToCart();
  }, [handleAddToCart, isAuthenticated]);

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }
    return `₹${price}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
          flip ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
        }`}>
          <div className="animate-pulse">
            <div className="bg-gray-200 h-[420px] w-full rounded-lg"></div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
            <div className="bg-gray-200 h-10 w-1/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !processedProduct) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
          flip ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
        }`}>
          <div className="animate-pulse">
            <div className="bg-gray-200 h-[420px] w-full rounded-lg"></div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
            <div className="bg-gray-200 h-10 w-1/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const { title, price, images, original, discount, brandLogo } = processedProduct;
  const maxQty = selectedColorObj?.sizes?.find(s => s.value === selectedSize)?.stock_quantity || 5;

  return (
    <div className="max-w-6xl mx-auto">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
          flip ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
        }`}
      >
        {/* LEFT - IMAGES */}
        <div>
          <ProductGallery 
            images={images} 
            brandLogo={brandLogo}
          />
        </div>

        {/* RIGHT - DETAILS */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </span>
              {original > price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(original)}
                </span>
              )}
            </div>
            {discount && (
              <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                {discount}
              </span>
            )}
          </div>

          {/* Color Selection */}
          {colorsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Color: {selectedColorObj?.name || "Select color"}
                </h3>
                <span className="text-sm text-gray-500">
                  {colorsList.length} {colorsList.length === 1 ? "color" : "colors"} available
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colorsList.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => {
                      setSelectedColor(color.key);
                      if (color.sizes.length > 0) {
                        setSelectedSize(color.sizes[0].value);
                      }
                    }}
                    className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === color.key
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400 hover:scale-105"
                    }`}
                    title={`${color.name}${color.sizes.length > 0 ? ` (${color.sizes.length} sizes)` : ''}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.hex || "#ccc" }}
                    ></div>
                    {selectedColor === color.key && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {allAvailableSizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Size: {selectedSize || "Select size"}
              </h3>
              <div className="grid grid-cols-4 xs:grid-cols-6 gap-2">
                {allAvailableSizes.map((size) => {
                  const isAvailable = selectedColorObj?.sizes?.some(s => s.value === size);
                  const sizeStock = selectedColorObj?.sizes?.find(s => s.value === size)?.stock_quantity || 0;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative py-3 rounded-lg border font-medium transition-all ${
                        selectedSize === size
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : !isAvailable || sizeStock === 0
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                      disabled={!isAvailable || sizeStock === 0}
                      title={
                        !isAvailable || sizeStock === 0
                          ? "Out of stock"
                          : `${sizeStock} in stock`
                      }
                    >
                      {size}
                      {sizeStock === 0 && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                          <div className="w-full h-px bg-gray-400 transform rotate-45"></div>
                        </div>
                      )}
                      {sizeStock > 0 && sizeStock < 10 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {sizeStock}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="font-medium text-lg min-w-8 text-center">{quantity}</span>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
              >
                +
              </button>
            </div>
            {maxQty < 10 && maxQty > 0 && (
              <p className="text-sm text-gray-600">
                Only {maxQty} items left in stock!
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedSize || !selectedColor}
            >
              {!selectedSize || !selectedColor ? "SELECT COLOR & SIZE" : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
        />
      )}
    </div>
  );
}