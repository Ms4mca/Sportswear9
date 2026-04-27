// SkeletonLoader.jsx
import React from "react";

const SkeletonLoader = () => {
  return (
    <main className="w-full bg-white pt-20 overflow-x-hidden animate-pulse">
      {/* ✅ Top Category Grid Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mb-12">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-42 lg:h-42 rounded-lg bg-gray-300"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Best Selling Products Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 max-w-full mb-12">
        <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-40 sm:w-48">
              <div className="w-full h-62 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Main Banner Carousel Skeleton */}
      <div className="w-full max-w-full mx-auto p-5 lg:p-10 rounded-2xl overflow-hidden mb-12">
        <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-300 rounded-xl"></div>
      </div>

      {/* ✅ Shop by Category Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mb-12">
        <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-56 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg bg-gray-300"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Recently Viewed Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mb-12">
        <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Sports Gear Carousel Skeleton */}
      <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 max-w-full mb-12">
        <div className="h-8 w-80 bg-gray-300 rounded mb-6"></div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              <div className="w-full h-32 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-3 w-20 bg-gray-300 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Trusted Brands Skeleton */}
      <section className="mt-12 sm:px-4 md:px-6 lg:px-12 xl:px-14 px-6 mx-auto max-w-full mb-12">
        <div className="h-8 w-64 bg-gray-300 rounded mb-2 mx-auto"></div>
        <div className="h-4 w-96 bg-gray-300 rounded mb-8 mx-auto"></div>
        <div className="grid grid-cols-5 md:grid-cols-6 xl:grid-cols-9 gap-4 sm:gap-6 max-w-full">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Video Section Skeleton */}
      <section className="mx-auto text-center px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 max-w-full mb-12">
        <div className="h-8 w-80 bg-gray-300 rounded mb-6 mx-auto"></div>
        <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
      </section>

      {/* ✅ Festive Deals Skeleton */}
      <div className="mb-12">
        <div className="h-8 w-48 bg-gray-300 rounded mb-6 mx-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Product Carousel Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mb-12">
        <div className="h-6 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-40">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Deals of the Day Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 mx-auto max-w-full mb-12">
        <div className="h-6 w-56 bg-gray-300 rounded mb-6"></div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-56">
              <div className="w-full h-72 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Trending Products Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mb-12">
        <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Sale Video Banner Skeleton */}
      <div className="relative w-full max-w-full md:h-[350px] overflow-hidden my-10 mb-12">
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      {/* ✅ Shop by Gender Skeleton */}
      <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full my-10 mb-12">
        <div className="w-full flex justify-between mb-6">
          <div className="h-8 w-64 bg-gray-300 rounded"></div>
          <div className="flex gap-4 border p-1 lg:p-2 rounded-lg lg:mr-[10%]">
            <div className="w-16 h-8 bg-gray-300 rounded-lg"></div>
            <div className="w-20 h-8 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        {/* Gender-specific carousel skeleton */}
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              <div className="w-full h-32 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-3 w-20 bg-gray-300 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ New Arrivals Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mb-12">
        <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-2"></div>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Sports Category Section Skeleton */}
      <div className="mb-12">
        <div className="h-8 w-64 bg-gray-300 rounded mb-6 mx-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Final Banner Images Skeleton */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full mb-10 overflow-hidden max-w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-full h-32 md:h-48 bg-gray-300 rounded"></div>
        ))}
      </div>

      {/* ✅ Final Large Banner Skeleton */}
      <div className="max-w-full mb-12">
        <div className="w-full h-48 md:h-64 bg-gray-300 px-2 md:px-5 lg:px-10 max-w-full"></div>
      </div>

      {/* ✅ Testimonials Skeleton */}
      <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 mx-auto py-12 max-w-full mb-12">
        <div className="h-8 w-80 bg-gray-300 rounded mb-2 mx-auto"></div>
        <div className="h-4 w-96 bg-gray-300 rounded mb-10 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white">
              <div className="h-6 w-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
              <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Available On Skeleton */}
      <section className="max-w-full mb-12">
        <div className="text-center lg:px-4 pt-10 lg:pb-10 max-w-full">
          <div className="h-8 w-64 bg-gray-300 rounded mb-8 mx-auto"></div>
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap w-full my-10 max-w-full px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-8 w-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SkeletonLoader;