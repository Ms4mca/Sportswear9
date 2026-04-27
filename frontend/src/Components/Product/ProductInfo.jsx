import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";
import { addToCart } from "../Cart/Cartslice";
import SEO from "../Common/SEO.jsx";
import {
  createReview,
  deleteReview,
  getReviewsByProduct,
  partialUpdateReview,
} from "./ReviewSlice";
import { fetchProfile } from "../Profile/Profileslice.js";
import {
  Star,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  MapPin,
  Check,
  Ruler,
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Award,
  Leaf,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Shirt,
  User,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Camera,
  Video,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
} from "lucide-react";
import {
  fetchProductDetail,
  clearProductDetail,
  fetchCompleteLook,
} from "./Productdetailslice";
import RecommendedProducts from "../Home/RecommendedProducts";
import ProductGallery from "./ProductGallery";

// Import review-related components (these are kept separate to reduce main file size)
import ReviewSummary from "./ReviewSummary";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import ReviewEditModal from "./ReviewEditModal";
import ReviewImageModal from "./ReviewImageModal";
import StarRatingDisplay from "./StarRatingDisplay";
import StarRatingInput from "./StarRatingInput";

const ProductInfo = () => {
  const { id, product_uuid } = useParams();
  const productId = id || product_uuid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  // Redux states
  const productFromState = useSelector((state) => state.productdetail?.data);
  const loading = useSelector((state) => state.productdetail?.loading);
  const error = useSelector((state) => state.productdetail?.error);
  const completeLookData = useSelector((state) => state.productdetail?.completeLook);
  const completeLookLoading = useSelector((state) => state.productdetail?.completeLookLoading);
  const completeLookError = useSelector((state) => state.productdetail?.completeLookError);
  const reviewsState = useSelector((state) => state.review);
  const profileData = useSelector((state) => state.profile.data);

  // Review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [sortReviewsBy, setSortReviewsBy] = useState("recent");

  // UI states
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [hoverRating, setHoverRating] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Review image modal state
  const [reviewImageModalOpen, setReviewImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  // Refs
  const reviewsSectionRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
  }, [dispatch, productId]);

  // Load reviews when product detail loads
  useEffect(() => {
    if (productFromState?.product_uuid) {
      dispatch(getReviewsByProduct(productFromState.product_uuid));
    }
  }, [dispatch, productFromState?.product_uuid]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, dispatch]);

  // Fetch complete look data when product is loaded
  useEffect(() => {
    if (productFromState?.product_uuid) {
      dispatch(fetchCompleteLook(productFromState.product_uuid));
    }
  }, [dispatch, productFromState?.product_uuid]);

  const product = useMemo(() => {
    if (!productFromState) return null;

    const title = productFromState.name || productFromState.title || "Product";
    const description = productFromState.description || "";

    let price = productFromState.net || productFromState.price || 0;
    let original = productFromState.price || productFromState.original || 0;
    let discount = productFromState.disc || productFromState.discount || 0;

    price = parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;
    original = parseFloat(String(original).replace(/[^0-9.-]+/g, "")) || 0;

    if (!discount && original > price && original > 0) {
      discount = Math.round(((original - price) / original) * 100);
    }

    const specifications =
      productFromState.specifications &&
      typeof productFromState.specifications === "object"
        ? productFromState.specifications
        : {};

    let images =
      Array.isArray(productFromState.default_images) &&
      productFromState.default_images.length > 0
        ? productFromState.default_images
        : [];

    if (images.length === 0) {
      const imgs = [];
      (productFromState.variants || []).forEach((v) => {
        (v.images || []).forEach((img) => {
          if (img.url && !imgs.find((i) => i.url === img.url)) {
            imgs.push(img);
          }
        });
      });
      images = imgs;
    }

    if (images.length === 0 && productFromState.brand?.logo) {
      images = [{ url: productFromState.brand.logo }];
    }

    const features = Array.isArray(productFromState.features)
      ? productFromState.features
      : [];

    const totalStock = (productFromState.variants || []).reduce(
      (total, variant) => {
        const variantStock = (variant.sizes || []).reduce((sum, size) => {
          return sum + (size.stock_quantity || 0);
        }, 0);
        return total + variantStock;
      },
      0,
    );

    const inStock = totalStock > 0;

    const reviews =
      Array.isArray(reviewsState.productReviews) &&
      reviewsState.productReviews.length > 0
        ? reviewsState.productReviews
        : Array.isArray(productFromState?.reviews)
          ? productFromState.reviews
          : [];

    const validReviews = reviews.filter((r) => r.rating !== null);
    const averageRating =
      validReviews.length > 0
        ? validReviews.reduce((a, r) => a + r.rating, 0) / validReviews.length
        : 0;

    return {
      ...productFromState,
      title,
      description,
      price,
      original,
      discount,
      specifications,
      images,
      features,
      inStock,
      totalStock,
      reviews,
      average_rating: averageRating,
    };
  }, [productFromState, reviewsState.productReviews]);

  const displayReviews = useMemo(() => {
    return Array.isArray(reviewsState.productReviews) &&
      reviewsState.productReviews.length > 0
      ? reviewsState.productReviews
      : Array.isArray(productFromState?.reviews)
        ? productFromState.reviews
        : [];
  }, [reviewsState.productReviews, productFromState?.reviews]);

  const reviewStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let total = 0;

    displayReviews.forEach(review => {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        stats[review.rating]++;
        total++;
      }
    });

    return {
      stats,
      total,
      percentages: {
        5: total ? (stats[5] / total) * 100 : 0,
        4: total ? (stats[4] / total) * 100 : 0,
        3: total ? (stats[3] / total) * 100 : 0,
        2: total ? (stats[2] / total) * 100 : 0,
        1: total ? (stats[1] / total) * 100 : 0,
      }
    };
  }, [displayReviews]);

  const sortedReviews = useMemo(() => {
    const reviews = [...displayReviews].filter(r => r.rating !== null);
    
    switch (sortReviewsBy) {
      case "recent":
        return reviews.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
      case "helpful":
        return reviews.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
      case "high":
        return reviews.sort((a, b) => b.rating - a.rating);
      case "low":
        return reviews.sort((a, b) => a.rating - b.rating);
      case "withMedia":
        return reviews.sort((a, b) => {
          const aHasMedia = (a.images?.length > 0 || a.videos?.length > 0) ? 1 : 0;
          const bHasMedia = (b.images?.length > 0 || b.videos?.length > 0) ? 1 : 0;
          return bHasMedia - aHasMedia;
        });
      default:
        return reviews;
    }
  }, [displayReviews, sortReviewsBy]);

  const processedCompleteLook = useMemo(() => {
    if (!completeLookData) return null;

    try {
      const items = completeLookData.items || completeLookData.products || [];

      return items.map((item) => {
        const imageUrl = 
          item.default_images && item.default_images.length > 0
            ? item.default_images[0].url
            : "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg";

        const price =
          parseFloat(
            String(item.net || item.price || 0).replace(/[^0-9.-]+/g, ""),
          ) || 0;
        
        const original =
          parseFloat(
            String(item.price || 0).replace(/[^0-9.-]+/g, ""),
          ) || 0;

        const variantsWithSizes = [];
        if (item.variants && item.variants.length > 0) {
          item.variants.forEach(variant => {
            if (variant.sizes && variant.sizes.length > 0) {
              variant.sizes.forEach(size => {
                variantsWithSizes.push({
                  variant_id: size.variant_id,
                  size_value: size.value,
                  color: variant.color,
                  color_id: variant.color_id,
                  stock_quantity: size.stock_quantity,
                  is_available: size.is_available
                });
              });
            }
          });
        }

        return {
          id: item.product_uuid || item.id || Math.random().toString(),
          product_uuid: item.product_uuid,
          title: item.name || item.title || "Complete Look Item",
          price: price,
          original: original > price ? original : null,
          image: imageUrl,
          inStock: true,
          variants: item.variants,
          variantsWithSizes: variantsWithSizes,
          discount: item.disc ? `${item.disc}% OFF` : null,
        };
      });
    } catch (error) {
      console.error("Error processing complete look data:", error);
      return null;
    }
  }, [completeLookData]);

  const refreshReviews = useCallback(() => {
    if (productFromState?.product_uuid) {
      dispatch(getReviewsByProduct(productFromState.product_uuid));
    }
  }, [dispatch, productFromState?.product_uuid]);

  const colorsList = useMemo(() => {
    if (!product || !Array.isArray(product.variants)) return [];

    const colors = [];

    product.variants.forEach((variant) => {
      const colorName = variant.color || "Default";
      const colorId = variant.color_id || colorName;
      const colorCode = variant.color_code || "#ccc";

      const availableSizes = (variant.sizes || [])
        .filter((size) => size.is_available && (size.stock_quantity || 0) > 0)
        .map((size) => ({
          value: size.value || "One Size",
          variant_id: size.variant_id,
          stock_quantity: size.stock_quantity,
          price: size.price,
        }));

      if (availableSizes.length > 0) {
        colors.push({
          key: colorId,
          name: colorName,
          hex: colorCode,
          images: variant.images || [],
          sizes: availableSizes,
          variant: variant,
        });
      }
    });

    return colors;
  }, [product]);

  useEffect(() => {
    if (colorsList.length > 0) {
      const firstAvailableColor = colorsList[0];
      setSelectedColor(firstAvailableColor.key);
      if (firstAvailableColor.sizes.length > 0) {
        setSelectedSize(firstAvailableColor.sizes[0].value);
      }
    }
  }, [colorsList]);

  const selectedColorObj = useMemo(() => {
    return colorsList.find((c) => c.key === selectedColor) || null;
  }, [colorsList, selectedColor]);

  const availableSizesForSelectedColor = useMemo(() => {
    return selectedColorObj?.sizes || [];
  }, [selectedColorObj]);

  const galleryImages = useMemo(() => {
    if (selectedColorObj?.images.length > 0) return selectedColorObj.images;
    return product?.images || [];
  }, [product, selectedColorObj]);

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
    const numericPrice = parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;
    return `₹${numericPrice.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const SportsWear9Product = useMemo(
    () => ({
      title: product?.title || "",
      price: product?.price ? formatPrice(product.price) : "₹0",
      original: product?.original && product.original > product.price ? formatPrice(product.original) : null,
      discount: product?.discount ? `${product.discount}% OFF` : null,
      description: (product?.description || "").replace(/&nbsp;/g, " "),
      features: product?.features || [],
      specifications: product?.specifications || {},
      inStock: product?.inStock || false,
      totalStock: product?.totalStock || 0,
      rating: product?.average_rating || 0,
      reviewCount: displayReviews.length || 0,
      deliveryDate: "3-10 days",
      brand: product?.brand?.name || "SportsWear9",
      madeIn: "India",
      sustainability: "Top Quality materials",
      skillLevel: "Beginner to Advanced",
      material: product?.specifications?.material || "100% Recycled Polyester",
      weight: product?.specifications?.weight || "450g",
      care: product?.specifications?.care || "Machine Washable",
      activityType: product?.specifications?.activityType || "Running, Training, Outdoor",
      seoDescription: (product?.description || "").replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").substring(0, 160),
    }),
    [product, displayReviews],
  );

  // Product highlights (inline)
  const productHighlights = useMemo(
    () => [
      "Designed and tested by sports experts",
      "Suitable for multiple sports activities",
      "Durable construction for long-lasting use",
      "Comfort fit for extended wear",
      "Moisture-wicking technology",
      "Anti-odor treatment",
      ...(product?.features || []),
    ],
    [product],
  );

  // Trust badges (inline)
  const trustBadges = [
    { icon: <RefreshCw className="w-5 h-5" />, text: "Easy Returns" },
    { icon: <Award className="w-5 h-5" />, text: "Quality Certified" },
    { icon: <Leaf className="w-5 h-5" />, text: "Top Quality" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Payment" },
  ];

  // Handlers
  const handleAddToCart = useCallback(() => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    if (!product || !selectedColorObj || !selectedSize) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: "❌ Please select color and size", type: "error" },
      }));
      return;
    }

    const selectedVariant = selectedColorObj.sizes.find(
      (size) => size.value === selectedSize,
    );

    if (!selectedVariant) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: "❌ Selected size is not available", type: "error" },
      }));
      return;
    }

    if (selectedVariant.stock_quantity < quantity) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: `❌ Only ${selectedVariant.stock_quantity} items available in stock`, type: "error" },
      }));
      return;
    }

    const payload = {
      product_uuid: product.product_uuid,
      variant_id: selectedVariant.variant_id,
      color_id: selectedColorObj.key,
      quantity: quantity,
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        window.dispatchEvent(new CustomEvent("showToast", {
          detail: { message: "✅ Added to cart successfully!", type: "success" },
        }));
        navigate("/cart");
      })
      .catch((err) => {
        window.dispatchEvent(new CustomEvent("showToast", {
          detail: { message: err?.message || "❌ Failed to add item to cart", type: "error" },
        }));
      });
  }, [product, selectedColorObj, selectedSize, quantity, dispatch, navigate, isAuthenticated]);

  const handleAddCompleteLookToCart = useCallback(async () => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    if (!processedCompleteLook || processedCompleteLook.length === 0) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: "❌ No complete look items available", type: "error" },
      }));
      return;
    }

    if (!product || !selectedColorObj || !selectedSize) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: "❌ Please select color and size for the main product", type: "error" },
      }));
      return;
    }

    const selectedVariant = selectedColorObj.sizes.find(
      (size) => size.value === selectedSize,
    );

    if (!selectedVariant) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: "❌ Selected size is not available for the main product", type: "error" },
      }));
      return;
    }

    if (selectedVariant.stock_quantity < quantity) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: `❌ Only ${selectedVariant.stock_quantity} items available in stock for main product`, type: "error" },
      }));
      return;
    }

    const mainProductCartItem = {
      product_uuid: product.product_uuid,
      variant_id: selectedVariant.variant_id,
      color_id: selectedColorObj.key,
      quantity: quantity,
    };

    const completeLookItems = [];
    const missingVariantItems = [];

    for (const item of processedCompleteLook) {
      let variantId = null;
      
      if (item.variants && item.variants.length > 0) {
        for (const variant of item.variants) {
          if (variant.sizes && variant.sizes.length > 0) {
            const matchingSize = variant.sizes.find(
              size => size.value === selectedSize && size.is_available && size.stock_quantity > 0
            );
            if (matchingSize) {
              variantId = matchingSize.variant_id;
              break;
            }
          }
        }
        
        if (!variantId) {
          for (const variant of item.variants) {
            if (variant.sizes && variant.sizes.length > 0) {
              const firstAvailableSize = variant.sizes.find(
                size => size.is_available && size.stock_quantity > 0
              );
              if (firstAvailableSize) {
                variantId = firstAvailableSize.variant_id;
                console.log(`No exact size ${selectedSize} match for ${item.title}, using ${firstAvailableSize.value} instead`);
                break;
              }
            }
          }
        }
      }

      if (variantId) {
        completeLookItems.push({
          product_uuid: item.product_uuid || item.id,
          variant_id: variantId,
          quantity: 1,
        });
      } else {
        missingVariantItems.push(item.title || 'Unknown item');
      }
    }

    if (missingVariantItems.length > 0) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: `❌ Cannot add: ${missingVariantItems.join(', ')} - no available variants`, type: "error" },
      }));
      return;
    }

    const allItems = [mainProductCartItem, ...completeLookItems];

    window.dispatchEvent(new CustomEvent("showToast", {
      detail: { message: `⏳ Adding ${allItems.length} items to cart with size ${selectedSize}...`, type: "info" },
    }));

    try {
      for (let i = 0; i < allItems.length; i++) {
        await dispatch(addToCart(allItems[i])).unwrap();
      }
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: `✅ Successfully added complete look (${allItems.length} items) to cart with size ${selectedSize}!`, type: "success" },
      }));
      navigate("/cart");
    } catch (err) {
      window.dispatchEvent(new CustomEvent("showToast", {
        detail: { message: err?.message || "❌ Failed to add some items to cart", type: "error" },
      }));
    }
  }, [product, selectedColorObj, selectedSize, quantity, processedCompleteLook, dispatch, navigate, isAuthenticated]);

  const handleProductClick = (productUuid) => {
    navigate(`/ProductInfo/${productUuid}`);
  };

  const handleSubmitReview = () => {
    if (!product || !product.product_uuid) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "❌ Product data not loaded yet.", type: "error" } }));
      return;
    }
    if (!rating || !comment) {
      alert("Rating and comment required");
      return;
    }
    const formData = new FormData();
    formData.append("product", product.product_uuid);
    formData.append("rating", rating);
    formData.append("comment", comment);
    imageFiles.forEach((img) => formData.append("uploaded_images", img));
    videoFiles.forEach((vid) => formData.append("uploaded_videos", vid));
    dispatch(createReview({ product_uuid: product.product_uuid, data: formData, isMultipart: true }))
      .unwrap()
      .then(() => {
        setRating(0);
        setComment("");
        setImageFiles([]);
        setVideoFiles([]);
        setShowReviewForm(false);
        refreshReviews();
        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "✅ Review submitted successfully!", type: "success" } }));
      })
      .catch((error) => {
        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: `❌ Failed to submit review: ${error.message}`, type: "error" } }));
      });
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdateReview = () => {
    if (!product || !product.product_uuid) {
      window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "❌ Product data not loaded yet.", type: "error" } }));
      return;
    }
    const formData = new FormData();
    formData.append("product", product.product_uuid);
    formData.append("rating", editRating);
    formData.append("comment", editComment);
    dispatch(partialUpdateReview({ review_id: editingReview.review_id, product_uuid: product.product_uuid, data: formData, isMultipart: true }))
      .unwrap()
      .then(() => {
        setEditingReview(null);
        refreshReviews();
        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "✅ Review updated successfully!", type: "success" } }));
      })
      .catch((error) => {
        window.dispatchEvent(new CustomEvent("showToast", { detail: { message: `❌ Failed to update review: ${error.message}`, type: "error" } }));
      });
  };

  const handleDeleteReview = (review_id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview({ review_id, product_uuid: product.product_uuid }))
        .unwrap()
        .then(() => {
          refreshReviews();
          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: "✅ Review deleted successfully!", type: "success" } }));
        })
        .catch((error) => {
          window.dispatchEvent(new CustomEvent("showToast", { detail: { message: `❌ Failed to delete review: ${error.message}`, type: "error" } }));
        });
    }
  };

  const handleHelpfulClick = (reviewId) => {
    setHelpfulReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const isCurrentUserReview = (review) => {
    const currentEmail = profileData?.email || user?.email;
    return review?.user_name === currentEmail;
  };

  const extractImageUrl = (img) => {
    return img?.image_url || img?.url || img;
  };

  const openImageModal = (images, startIndex = 0) => {
    const urls = images.map(extractImageUrl).filter(Boolean);
    if (urls.length === 0) return;
    setModalImages(urls);
    setModalIndex(startIndex);
    setReviewImageModalOpen(true);
  };

  const closeImageModal = () => {
    setReviewImageModalOpen(false);
    setModalImages([]);
    setModalIndex(0);
  };

  const prevImage = () => setModalIndex((i) => (i - 1 + modalImages.length) % modalImages.length);
  const nextImage = () => setModalIndex((i) => (i + 1) % modalImages.length);

  useEffect(() => {
    if (!reviewImageModalOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeImageModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [reviewImageModalOpen, modalImages.length]);

  if (loading) {
    return (
      <div className="pt-20 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 h-20 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              <div className="bg-gray-200 h-12 rounded w-1/3"></div>
              <div className="bg-gray-200 h-20 rounded w-full"></div>
              <div className="bg-gray-200 h-12 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">Error loading product details</p>
            <p className="text-red-500 text-sm mb-4">{error || "Product not found"}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.history.back()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${product.title} - SportsWear9`}
        description={SportsWear9Product.seoDescription}
        keywords={`${product.title}, sports wear, fitness gear`}
        image={galleryImages[0]?.url}
      />
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:items-start lg:gap-12">
            {/* Left Column - Product Gallery */}
            <div className="lg:w-1/2 space-y-4 lg:sticky lg:top-24 lg:h-fit lg:pb-8">
              <ProductGallery
                images={galleryImages}
                brandLogo={product.brand?.logo}
              />
              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                {trustBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="text-blue-600 mb-2">{badge.icon}</div>
                    <span className="text-xs font-medium text-gray-700 leading-tight">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-1/2 space-y-6 px-4">
              {/* Brand and Title */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    {SportsWear9Product.brand}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-tight">
                  {SportsWear9Product.title}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <StarRatingDisplay rating={SportsWear9Product.rating} size={16} />
                  <span className="text-sm font-medium text-gray-700">
                    {SportsWear9Product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({SportsWear9Product.reviewCount} reviews)
                </span>
                {SportsWear9Product.reviewCount > 0 && (
                  <button
                    onClick={() => {
                      setActiveTab("reviews");
                      reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all reviews
                  </button>
                )}
              </div>

              {/* Made in India Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <span className="text-sm font-medium">Made in India</span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {SportsWear9Product.price}
                  </span>
                  {SportsWear9Product.original && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      {SportsWear9Product.original}
                    </span>
                  )}
                </div>
                {SportsWear9Product.discount && (
                  <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                    Save {SportsWear9Product.discount}
                  </span>
                )}
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    Delivery in {SportsWear9Product.deliveryDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {SportsWear9Product.skillLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {SportsWear9Product.sustainability}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    1 Year Warranty
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              {colorsList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      Color: {selectedColorObj?.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {colorsList.length} color{colorsList.length > 1 ? "s" : ""} available
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colorsList.map((color) => {
                      const variantImage = color.images?.[0]?.url || null;
                      return (
                        <button
                          key={color.key}
                          onClick={() => {
                            setSelectedColor(color.key);
                            if (color.sizes.length > 0) {
                              setSelectedSize(color.sizes[0].value);
                            }
                          }}
                          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all group ${
                            selectedColor === color.key
                              ? "border-blue-600 ring-2 ring-blue-200"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          title={color.name}
                        >
                          {variantImage ? (
                            <img
                              src={variantImage}
                              alt={color.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.backgroundColor = color.hex || "#ccc";
                                e.target.src = "";
                              }}
                            />
                          ) : (
                            <div
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                              style={{ backgroundColor: color.hex || "#ccc" }}
                            />
                          )}
                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                            {color.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizesForSelectedColor.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      Size: {selectedSize || "Select size"}
                    </h3>
                    <Link to="/SizeGuide">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        Size Guide
                      </button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSizesForSelectedColor.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size.value)}
                        className={`relative py-2 sm:py-3 rounded-lg border font-medium transition-all text-sm sm:text-base group ${
                          selectedSize === size.value
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : size.stock_quantity === 0
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        disabled={size.stock_quantity === 0}
                        title={
                          size.stock_quantity === 0
                            ? "Out of stock"
                            : `${size.stock_quantity} in stock`
                        }
                      >
                        {size.value}
                        {size.stock_quantity === 0 && (
                          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                            <div className="w-full h-px bg-gray-400 transform rotate-45"></div>
                          </div>
                        )}
                        {size.stock_quantity > 0 && size.stock_quantity < 10 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {size.stock_quantity}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4 border border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="font-semibold text-gray-900 text-base">Quantity</span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 sm:px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center font-semibold text-sm sm:text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={selectedColorObj?.sizes.find(s => s.value === selectedSize)?.stock_quantity <= quantity}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={isAuthenticated ? handleAddToCart : () => { setAuthMode("login"); setAuthOpen(true); }}
                    disabled={!selectedColor || !selectedSize || !SportsWear9Product.inStock}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                      !selectedColor || !selectedSize || !SportsWear9Product.inStock
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {!SportsWear9Product.inStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${SportsWear9Product.inStock ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className={SportsWear9Product.inStock ? "text-green-600" : "text-red-600"}>
                    {SportsWear9Product.inStock ? `In stock (${SportsWear9Product.totalStock} available)` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Free delivery</p>
                    <p className="text-sm text-gray-600 truncate">Get it by {SportsWear9Product.deliveryDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Store pickup available</p>
                    <p className="text-sm text-gray-600 truncate">Check availability in stores near you</p>
                  </div>
                </div>
              </div>

              {/* Product Highlights (inline) */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-900 mb-3 text-base">Product Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {productHighlights.slice(0, 6).map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete The Look Section (inline) */}
              {processedCompleteLook && processedCompleteLook.length > 0 && (
                <div className="mt-10 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Complete The Look</h3>

                  {completeLookLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading complete look...</span>
                    </div>
                  ) : completeLookError ? (
                    <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-yellow-700">Unable to load complete look suggestions.</p>
                      <button
                        onClick={() => dispatch(fetchCompleteLook(product.product_uuid))}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-start overflow-x-auto scrollbar-hide pb-4">
                        {/* Main Product */}
                        <div className="flex flex-col items-center text-center min-w-[140px] sm:min-w-[160px]">
                          <img
                            src={galleryImages?.[0]?.url || "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"}
                            alt="Main product"
                            className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleProductClick(product.product_uuid)}
                            onError={(e) => { e.target.src = "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"; }}
                          />
                          <div
                            className="mt-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer hover:text-blue-600 line-clamp-2"
                            onClick={() => handleProductClick(product.product_uuid)}
                          >
                            This item: {SportsWear9Product.title}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{SportsWear9Product.price}</div>
                        </div>

                        <span className="text-2xl text-gray-500 mt-12 font-semibold">+</span>

                        {processedCompleteLook.map((item, index) => (
                          <React.Fragment key={item.id}>
                            <div className="flex flex-col items-center text-center min-w-[140px] sm:min-w-[160px]">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleProductClick(item.product_uuid)}
                                onError={(e) => {
                                  e.target.src = "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg";
                                }}
                              />
                              <div
                                className="mt-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer hover:text-blue-600 line-clamp-2"
                                onClick={() => handleProductClick(item.product_uuid)}
                              >
                                {item.title}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</div>
                                {item.original && item.original > item.price && (
                                  <div className="text-xs text-gray-500 line-through">{formatPrice(item.original)}</div>
                                )}
                              </div>
                              {item.discount && (
                                <div className="mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                  {item.discount}
                                </div>
                              )}
                            </div>
                            {index !== processedCompleteLook.length - 1 && (
                              <span className="text-2xl text-gray-500 mt-12 font-semibold">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="mt-6 text-center pt-4">
                        <p className="text-gray-700 text-lg mb-1 font-medium">Total price for complete look:</p>
                        <p className="text-xl font-bold text-gray-900 mb-4">
                          {(() => {
                            const mainProductPrice = parseFloat(
                              String(SportsWear9Product.price).replace("₹", "").replace(/,/g, "")
                            ) || 0;
                            const completeLookTotal = processedCompleteLook.reduce((acc, item) => acc + (item.price || 0), 0);
                            return formatPrice(mainProductPrice + completeLookTotal);
                          })()}
                        </p>
                        <button
                          onClick={handleAddCompleteLookToCart}
                          disabled={!selectedColor || !selectedSize || !SportsWear9Product.inStock}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add Complete Look to Cart ({processedCompleteLook.length + 1} items)
                        </button>
                        <p className="text-sm text-gray-500 mt-3">Save 15% when you buy the complete look!</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="w-full mt-12 lg:mt-16">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                  { id: "description", label: "Description" },
                  { id: "specifications", label: "Specifications" },
                  { id: "reviews", label: `Reviews (${SportsWear9Product.reviewCount})` },
                  { id: "shipping", label: "Shipping & Returns" },
                  { id: "features", label: "Key Features" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-4 sm:px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-0 py-6 sm:py-8">
              {/* Description Tab */}
              {activeTab === "description" && (
                <div className="max-w-full">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Product Description</h3>
                  <div 
                    className="text-gray-700 leading-relaxed mb-6 rich-text-description"
                    dangerouslySetInnerHTML={{ __html: SportsWear9Product.description }}
                  />
                  
                  <style dangerouslySetInnerHTML={{ __html: `
                    .rich-text-description {
                      word-break: break-word;
                      overflow-wrap: break-word;
                      max-width: 100%;
                    }
                    .rich-text-description img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 0.75rem;
                      margin: 1.5rem 0;
                      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    }
                    .rich-text-description ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin: 1.25rem 0;
                    }
                    .rich-text-description ol {
                      list-style-type: decimal;
                      padding-left: 1.5rem;
                      margin: 1.25rem 0;
                    }
                    .rich-text-description li {
                      margin-bottom: 0.5rem;
                      word-break: break-word;
                    }
                    .rich-text-description p {
                      margin-bottom: 1rem;
                      word-break: break-word;
                    }
                    .rich-text-description h1, .rich-text-description h2, .rich-text-description h3 {
                      color: #111827;
                      font-weight: 700;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                      word-break: break-word;
                    }
                    .rich-text-description strong {
                      color: #111827;
                      font-weight: 600;
                    }
                    .rich-text-description blockquote {
                      border-left: 4px solid #3b82f6;
                      padding-left: 1rem;
                      margin: 1.5rem 0;
                      font-style: italic;
                      color: #4b5563;
                      word-break: break-word;
                    }
                  `}} />
                  {SportsWear9Product.features.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      {SportsWear9Product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">Feature {index + 1}</h4>
                            <p className="text-sm text-gray-600 mt-1">{feature}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === "specifications" && (
                <div className="max-w-full">
                  <h3 className="text-lg font-semibold mb-6">Technical Specifications</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {Object.entries({
                      Material: SportsWear9Product.material,
                      Weight: SportsWear9Product.weight,
                      "Care Instructions": SportsWear9Product.care,
                      "Made In": SportsWear9Product.madeIn,
                      "Activity Type": SportsWear9Product.activityType,
                      "Skill Level": SportsWear9Product.skillLevel,
                      ...SportsWear9Product.specifications,
                    })
                      .filter(([key, value]) => value && value !== "")
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200 last:border-b-0 flex-wrap gap-2">
                          <span className="text-gray-600 font-medium text-sm sm:text-base">{key}</span>
                          <span className="text-gray-900 font-semibold text-sm sm:text-base text-right">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div className="max-w-full">
                  <h3 className="text-lg font-semibold mb-6">Key Features & Benefits</h3>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {productHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{highlight}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === "shipping" && (
                <div className="max-w-full">
                  <h3 className="text-lg font-semibold mb-6">Shipping & Returns</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Delivery Options</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Free standard delivery on orders over ₹999</li>
                        <li>• Express delivery available</li>
                        <li>• Store pickup within 2 hours</li>
                        <li>• Same day delivery in select cities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Return Policy</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• 30-day return policy</li>
                        <li>• Free returns for quality issues</li>
                        <li>• Easy online return process</li>
                        <li>• No questions asked returns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div ref={reviewsSectionRef} className="max-w-full">
                  <ReviewSummary
                    totalReviews={reviewStats.total}
                    averageRating={SportsWear9Product.rating}
                    reviewStats={reviewStats}
                    isAuthenticated={isAuthenticated}
                    showReviewForm={showReviewForm}
                    setShowReviewForm={setShowReviewForm}
                    setAuthMode={setAuthMode}
                    setAuthOpen={setAuthOpen}
                  />

                  {showReviewForm && isAuthenticated && (
                    <ReviewForm
                      rating={rating}
                      setRating={setRating}
                      hoverRating={hoverRating}
                      setHoverRating={setHoverRating}
                      comment={comment}
                      setComment={setComment}
                      imageFiles={imageFiles}
                      setImageFiles={setImageFiles}
                      videoFiles={videoFiles}
                      setVideoFiles={setVideoFiles}
                      handleSubmitReview={handleSubmitReview}
                      setShowReviewForm={setShowReviewForm}
                    />
                  )}

                  {displayReviews.length > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Customer Reviews ({displayReviews.length})
                        </h3>
                        <select
                          value={sortReviewsBy}
                          onChange={(e) => setSortReviewsBy(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="helpful">Most Helpful</option>
                          <option value="high">Highest Rated</option>
                          <option value="low">Lowest Rated</option>
                          <option value="withMedia">With Photos/Videos</option>
                        </select>
                      </div>

                      <div className="space-y-6">
                        {sortedReviews.map((review) => (
                          <ReviewItem
                            key={review.review_id || review.id}
                            review={review}
                            formatDate={formatDate}
                            extractImageUrl={extractImageUrl}
                            openImageModal={openImageModal}
                            isAuthenticated={isAuthenticated}
                            isCurrentUserReview={isCurrentUserReview}
                            startEdit={startEdit}
                            handleDeleteReview={handleDeleteReview}
                            handleHelpfulClick={handleHelpfulClick}
                            helpfulReviews={helpfulReviews}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <RecommendedProducts product_id={product.product_uuid} />
          </div>
        </div>

        {/* Modals */}
        {editingReview && (
          <ReviewEditModal
            editingReview={editingReview}
            setEditingReview={setEditingReview}
            editRating={editRating}
            setEditRating={setEditRating}
            hoverRating={hoverRating}
            setHoverRating={setHoverRating}
            editComment={editComment}
            setEditComment={setEditComment}
            handleUpdateReview={handleUpdateReview}
          />
        )}

        {reviewImageModalOpen && (
          <ReviewImageModal
            modalImages={modalImages}
            modalIndex={modalIndex}
            closeImageModal={closeImageModal}
            prevImage={prevImage}
            nextImage={nextImage}
          />
        )}

        {showSizeGuide && <SizeGuideModal />}
        {authOpen && (
          <AuthModal
            isOpen={authOpen}
            onClose={() => setAuthOpen(false)}
            mode={authMode}
            setMode={setAuthMode}
          />
        )}
      </div>
    </>
  );
};

export default ProductInfo;