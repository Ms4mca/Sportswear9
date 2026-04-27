import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../Common/SEO";
import HomepageReviewCarousel from "./HomepageReviewCarousel";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../Product/productslice";
import {
  fetchHomepageLevels,
  selectHomepageLevels,
  selectHomepageLoading,
  selectHomepageError,
} from "./HomePageSlice";
import { ProductCard } from "../Product/Product";
import { Link } from "react-router-dom";
import PopularProductsCarousel from "../Decath/PopularProductsCarousel";
import CategoryGrid from "../Decath/CategoryGrid";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";
import SportsGearCarousel from "../Decath/SportsGearCarousel";
import FestiveDealsGrid from "../Decath/FestiveDealsGrid";
import VideoGrid from "./VideoGrid";
import { DealsOfTheDay } from "../Banner&Carousels/DealsOfTheDay";
import { fetchBrands } from "../Brands/brandlistslice";
import SportsCategorySection from "./SportsCategorysection";
import ProductDetail from "./ProductDetail";
import ProductImageShowcase from "./ProductImageShowcase";
import { fetchRecentlyViewed } from "../Profile/Profileslice";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/media";

// ✅ Filtering Helpers
const transformProductData = (product) => ({
  id: product.product_uuid,
  title: product.name,
  price: `${product.price}`,
  original: product.original,
  discount: product.discount,
  brand: product.brand?.name,
  category: product.category?.name,
  img: product.img,
  img2: product.img2,
  isFeatured: product.is_featured,
  bestselling: product.bestselling,
  newArrivals: product.is_new,
  isTrending: product.isTrending,
  Deals: product.deal_of_the_day,
});

// ✅ Loading Skeletons with consistent spacing
const CategoryGridSkeleton = () => (
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProductCarouselSkeleton = () => (
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
    <div className="flex space-x-4 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="min-w-[200px] h-[300px] bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
        ></div>
      ))}
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="h-[300px] bg-gray-200 rounded-lg animate-pulse"
      ></div>
    ))}
  </div>
);

const BrandsSkeleton = () => (
  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-6">
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gray-200 animate-pulse mx-auto"
      ></div>
    ))}
  </div>
);

const LandscapeCarouselSkeleton = () => (
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] bg-gray-200 rounded-2xl animate-pulse"></div>
  </div>
);

const VideoGridSkeleton = () => (
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="aspect-video bg-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

const SportsCategorySectionSkeleton = () => (
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-[200px] bg-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

const DealsSectionSkeleton = () => (
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[250px] bg-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

function Home2() {
  const dispatch = useDispatch();
  const apiProducts = useSelector(selectAllProducts);
  const { isAuthenticated } = useAuth();
  const productsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);

  const { recentlyViewed, loadingRecentlyViewed } = useSelector(
    (state) => state.profile,
  );

  const homepageData = useSelector(selectHomepageLevels);
  const homepageLoading = useSelector(selectHomepageLoading);
  const homepageError = useSelector(selectHomepageError);

  const { brands, loading: brandsLoading } = useSelector(
    (state) => state.brandlist,
  ) || { brands: [], loading: false };

  const [selectedGender, setSelectedGender] = useState("men");

  useEffect(() => {
    dispatch(fetchRecentlyViewed());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchHomepageLevels());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const products = apiProducts.map(transformProductData);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellingProducts = products.filter((p) => p.bestselling);
  const trending = products.filter((p) => p.isTrending);
  const newArrivals = products.filter((p) => p.newArrivals);
  const dealProducts = products.filter((p) => p.Deals === true);

  const displayproduct1 = dealProducts[0];
  const displayproduct2 = dealProducts[1];

  const getSectionData = (sectionTitle) => {
    if (
      !homepageData ||
      homepageData.length === 0 ||
      !homepageData[0]?.sections
    )
      return [];

    const level = homepageData[0];
    const section = level.sections.find((sec) => sec.title === sectionTitle);
    return section ? section.items : [];
  };

  const transformToCarouselItems = (items) => {
    return items.map((item) => ({
      id: item.item_uuid,
      image: item.media?.[0]?.image || "",
      image: resolveMediaUrl(item.media?.[0]?.image || ""),
      title: item.title,
      subtitle: item.subtitle,
      video: item.media?.[0]?.video || "",
      thumbnail: resolveMediaUrl(item.media?.[0]?.thumbnail || ""),
      link: item.media[0]?.link || "#",
    }));
  };

  const transformToCategoryItems = (items) => {
    return items.map((item) => ({
      name: item.title,
      image: resolveMediaUrl(item.media?.[0]?.image || ""),
      subtitle: item.subtitle,
      video: item.media?.[0]?.video || "",
      thumbnail: resolveMediaUrl(item.media?.[0]?.thumbnail || ""),
      link: item.media[0]?.link || "#",
    }));
  };

  const transformToVideoItems = (items) => {
    return items
      .filter((item) => item.media?.[0]?.media_type === "video")
      .map((item) => ({
        id: item.item_uuid,
        title: item.title,
        subtitle: item.subtitle,
        image: resolveMediaUrl(item.media?.[0]?.thumbnail || ""),
        video:
          item.media?.[0]?.video?.video_url ||
          item.media?.[0]?.video?.video ||
          "",
        thumbnail: resolveMediaUrl(item.media?.[0]?.thumbnail || ""),
        link: item.media?.[0]?.link || item.link || "",
        media: item.media || [],
        order: item.order,
      }));
  };

  const bannerItem = transformToCategoryItems(
    getSectionData("floor-2")?.slice(2, 3) || [],
  );

  if (homepageError && productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl text-red-500 p-8">
          <p className="text-lg font-semibold">
            Error loading page content.
          </p>
          <p className="mt-2 text-sm text-red-400">
            Homepage error: {homepageError}
          </p>
          <p className="mt-1 text-sm text-red-400">
            Product error: {productsError}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            If this is happening only on the live site, the backend likely needs to allow your Vercel domain in CORS/SSL settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full bg-white">
      <div className="space-y-16 md:space-y-20 lg:space-y-24">
        {/* SEO */}
        <SEO
          title="Sportswear9 - Premium Sports & Fitness Apparel"
          description="Shop the best sports clothing, gym wear, and fitness accessories. Free delivery on orders over ₹1000."
        />

        {/* Section 1 - Top Category Grid */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {homepageLoading ? (
            <CategoryGridSkeleton />
          ) : (
            <CategoryGrid
              categories={transformToCategoryItems(getSectionData("floor-1"))}
              border="border-2 border-amber-400"
            />
          )}
        </div>

        {/* Section 2 - Landscape Carousel */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {homepageLoading ? (
            <LandscapeCarouselSkeleton />
          ) : (
            <LandscapeCarousel
              items={transformToCarouselItems(getSectionData("floor-2"))}
            />
          )}
        </div>

        {/* Section 3 - Best Selling Products */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {productsLoading ? (
            <ProductCarouselSkeleton />
          ) : (
            <PopularProductsCarousel
              title="Best Selling"
              highlight="Products"
              products={bestSellingProducts}
            />
          )}
        </div>

        {/* Section 4 - Landscape Carousel */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {homepageLoading ? (
            <LandscapeCarouselSkeleton />
          ) : (
            <LandscapeCarousel
              items={transformToCarouselItems(getSectionData("floor-3"))}
            />
          )}
        </div>

        {/* Section 5 - Shop by Category */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {homepageLoading ? (
            <CategoryGridSkeleton />
          ) : (
            <CategoryGrid
              title="Shop by Category"
              subtitle="Find Your Perfect Gear"
              categories={transformToCategoryItems(getSectionData("floor-1"))}
              columns="grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
            />
          )}
        </div>

        {/* Section 6 - Recently Viewed / Featured Products */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {isAuthenticated ? (
            <>
              <h2 className="font-bold uppercase text-base md:text-xl text-foreground mb-6">
                Recently Viewed
              </h2>
              {loadingRecentlyViewed ? (
                <ProductGridSkeleton />
              ) : recentlyViewed?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recentlyViewed.map((item, index) => (
                    <ProductCard
                      key={item.id || item.product_uuid || index}
                      product={item}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No products viewed yet. Start exploring!
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-bold uppercase text-base md:text-xl text-foreground mb-6">
                Featured Products
              </h2>
              {productsLoading ? (
                <ProductGridSkeleton />
              ) : featuredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No featured products available.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Section 7 - Product Details */}
        {displayproduct1 && (
          <div className="  mx-auto px-4 sm:px-6 lg:px-8">
            <ProductDetail product={displayproduct1} />
          </div>
        )}

        {displayproduct2 && (
          <div className="  mx-auto px-4 sm:px-6 lg:px-8">
            <ProductDetail product={displayproduct2} flip />
          </div>
        )}

        {/* Section 8 - Trusted Brands */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-3xl md:text-4xl text-center mb-4">
            Trusted by Iconic Brands
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Discover collections from globally loved athletic and lifestyle
            brands.
          </p>
          {brandsLoading ? (
            <BrandsSkeleton />
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-6 md:gap-8">
              {brands.map((brand, i) => (
                <Link
                  to={`/brand/${brand.name}`}
                  key={i}
                  className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-gray-400 p-1 md:p-4 shadow-md">
                    <img
                      src={resolveMediaUrl(brand.logo)}
                      className="w-full h-full object-cover"
                      alt={brand.name}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Section 9 - Video Section */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl md:text-4xl text-center mb-8">
            Your Passion. Your Performance.
          </h2>
          {homepageLoading ? (
            <VideoGridSkeleton />
          ) : (
            <VideoGrid
              videos={transformToVideoItems(getSectionData("video grid"))}
            />
          )}
        </div>

        {/* Section 10 - Festive Deals */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <FestiveDealsGrid
            title="Trends of the Week!"
            items={transformToCategoryItems(getSectionData("festive floor"))}
          />
        </div>

        {/* Section 11 - Deals of the Day */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {productsLoading ? (
            <DealsSectionSkeleton />
          ) : (
            <DealsOfTheDay
              title="Shop Now: Deals of the Day"
              items={transformToCarouselItems(getSectionData("deals floor"))}
            />
          )}
        </div>

        {/* Section 12 - Trending Products */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold uppercase text-base md:text-xl text-foreground mb-6">
            TRENDING PRODUCTS
          </h2>
          {productsLoading ? (
            <ProductGridSkeleton />
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No featured products available.</p>
          )}
        </div>

        {/* Section 13 - Trending Men & Women */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="">
            <h2 className="mx-auto max-w-2xl rounded-md text-center text-lg lg:text-3xl font-bold bg-amber-600 text-white py-3 px-6 mb-8">
              TRENDING RIGHT NOW FOR MEN'S
            </h2>
            <ProductImageShowcase
              images={transformToCarouselItems(
                getSectionData("trending men floor"),
              )}
            />
          </div>

          <div className="mt-20">
            <h2 className="mx-auto max-w-2xl rounded-md text-center text-lg lg:text-3xl font-bold bg-cyan-800 text-white py-3 px-6 mb-8">
              TRENDING RIGHT NOW FOR WOMEN'S
            </h2>
            <ProductImageShowcase
              images={transformToCarouselItems(
                getSectionData("trending women floor"),
              )}
            />
          </div>
        </div>

        {/* Section 14 - Featured Categories by Gender */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              FEATURED <span className="font-semibold">CATEGORIES</span>
            </h2>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {["men", "women"].map((gender) => (
                <button
                  key={gender}
                  className={`px-8 py-2 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    selectedGender === gender
                      ? "bg-black text-white shadow-lg"
                      : "bg-transparent text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedGender(gender)}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {productsLoading ? (
            <ProductCarouselSkeleton />
          ) : (
            <>
              {selectedGender === "men" && (
                <SportsGearCarousel
                  title="Mens Products"
                  items={transformToCategoryItems(
                    getSectionData("men's floor"),
                  )}
                />
              )}

              {selectedGender === "women" && (
                <SportsGearCarousel
                  title="Women Products"
                  items={transformToCategoryItems(
                    getSectionData("women's floor"),
                  )}
                />
              )}
            </>
          )}
        </div>

        {/* Section 15 - New Arrivals */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold uppercase text-base md:text-xl text-foreground mb-6">
            New Arrivals
          </h2>
          {productsLoading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Section 16 - Sports Category */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          {homepageLoading ? (
            <SportsCategorySectionSkeleton />
          ) : (
            <SportsCategorySection
              categories={transformToCategoryItems(getSectionData("png-floor"))}
            />
          )}
        </div>

        {/* Section 17 - Get Gym Ready Banner */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold uppercase text-base md:text-xl text-foreground mb-6">
            GET GYM READY
          </h2>
          {homepageLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {transformToCategoryItems(getSectionData("floor-4")).map(
                (imgs, index) => (
                  <Link to={imgs.link} key={index} className="block">
                    <img
                      src={imgs.image}
                      alt=""
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                ),
              )}
            </div>
          )}
        </div>

        {/* Section 18 - Final Banner */}
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={"/product/CAT-5SZ7847WB2XQ"} className="block">
            <img
              src={bannerItem[0]?.image}
              alt="Buy More Save More"
              className="w-full h-auto rounded-2xl hover:opacity-95 transition-opacity"
            />
          </Link>
        </div>

        {/* Section 19 - Testimonials */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
            Hear from Our Community
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Real people. Real stories. Designed to move with your life.
          </p> */}

          {/* Replace the static grid with the new carousel */}
          <HomepageReviewCarousel />
        </div>
      </div>
    </main>
  );
}

export default Home2;
