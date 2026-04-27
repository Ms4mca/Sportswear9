import React from "react";
import { Link } from "react-router-dom";

const FestiveDealsGrid = ({ title = "Trends of the Week!", items = [] }) => {
  return (
    <div className="w-full bg-background">
      {title && (
        <div className="mb-6">
          <h2 className="font-bold uppercase text-base md:text-xl text-foreground">
            {title}
          </h2>
        </div>
      )}
      
      <div className="flex flex-wrap -mx-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="mb-4 px-2 w-6/12 sm:w-4/12 md:w-3/12 lg:w-3/12"
          >
            <Link to={item.link || "#"} className="block">
              <div className="relative flex flex-col min-w-0 overflow-hidden bg-transparent border-none hover:scale-105 transition-transform duration-300">
                <img
                  alt={item.name}
                  loading="lazy"
                  src={item.image}
                  className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestiveDealsGrid;