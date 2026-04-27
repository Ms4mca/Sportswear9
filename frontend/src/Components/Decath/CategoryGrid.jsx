import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = ({ 
  title = "", 
  subtitle = "",
  categories = [],
  columns = "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8",
  showTitle = true,
  className = "",
  border = "",
  link = ""
}) => {
  return (
    <div className={`w-full bg-background ${className}`}>
      {showTitle && (title || subtitle) && (
        <div className="mb-6">
          {subtitle && (
            <p className="text-[10px] sm:text-xs md:text-sm text-text-secondary uppercase tracking-wide mb-1">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="font-bold uppercase text-base md:text-xl text-foreground">
              {title}
            </h2>
          )}
        </div>
      )}
      
      <div className={`grid ${columns} gap-2 sm:gap-3 md:gap-4 lg:gap-8`}>
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.link || "#"}
            className="group flex flex-col items-center"
          >
            <div className={`w-full aspect-square relative overflow-hidden rounded-lg bg-background mb-2 ${border}`}>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="text-center w-full px-1">
              <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-medium text-text break-words line-clamp-2 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;