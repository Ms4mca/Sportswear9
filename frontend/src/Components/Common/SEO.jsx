import React from "react";
import { Helmet } from "@dr.pogodin/react-helmet";

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  ogImageAlt,
  productData,
  author = "sportswear9",
  structuredData,
}) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.sportswear9.com";

  const currentUrl =
    canonical ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://www.sportswear9.com");

  // Default meta image
  const defaultImage = `${baseUrl}/Sportswear9.png`;
  const metaImage = ogImage || defaultImage;

  // Generate structured data for products
  const generateProductSchema = () => {
    if (!productData) return null;

    // Use the top-level img/img2 fields (your API shape)
    const images = [productData.img, productData.img2].filter(Boolean);

    const priceValue =
      productData.net ??
      productData.price ??
      productData.original ??
      "0";

    const isInStock =
      productData.variants?.some((v) =>
        v.sizes?.some((s) => s.is_available)
      ) ?? true; // default to InStock if no variant data

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: productData.name || productData.title,
      description: productData.description || description,
      image: images,
      brand: {
        "@type": "Brand",
        "name": productData.brand?.name || "Sportswear9"
      },
      offers: {
        "@type": "Offer",
        url: currentUrl,
        priceCurrency: "INR",
        price: String(priceValue).replace(/[^0-9.]/g, ""), // strip ₹ / commas
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        availability: isInStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
      sku: productData.product_uuid,
      category: productData.category?.name || productData.category,
    };

    // Only add aggregateRating if we actually have one
    if (productData.average_rating) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(productData.average_rating),
        reviewCount: productData.total_reviews || productData.reviews?.length || 1,
      };
    }

    return schema;
  };

  const schemaData = productData ? generateProductSchema() : structuredData;

  // Extra product images for og:image (only when productData present)
  const extraOgImages = productData
    ? [productData.img, productData.img2].filter(Boolean)
    : [];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={metaImage} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:site_name" content="sportswear9" />

      {/* Twitter — card should be "summary_large_image", NOT the image URL */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}

      {/* Crawling */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />

      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}

      {/* Extra product images */}
      {extraOgImages.map((imgUrl, idx) => (
        <meta key={idx} property="og:image" content={imgUrl} />
      ))}
    </Helmet>
  );
};

export default SEO;