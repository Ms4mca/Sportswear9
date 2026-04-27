import React from "react";
import { ProductCard } from "../Product/Product";

const PopularProductsCarousel = ({ 
  title = "Best Selling",
  subtitle = "",
  products = [] 
}) => {
  const mappedProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    img: product.img,
    img2: product.img2,
    brand: product.brand,
    price: product.price,
    original: product.original,
    discount: product.discount,
    rating: { rate: product.rating, count: product.reviews },
    category: product.category || "",
    isFeatured: product.is_featured,
  }));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        {subtitle && (
          <p className="text-muted-foreground text-sm md:text-block">
            {subtitle}
          </p>
        )}
        <h2 className="font-bold uppercase text-base md:text-xl text-foreground">
          {title}
        </h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mappedProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PopularProductsCarousel;