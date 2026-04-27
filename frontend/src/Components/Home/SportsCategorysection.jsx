import React from "react";
import { Link } from "react-router-dom";

const SportsCategorySection = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="font-bold uppercase text-base md:text-xl text-foreground mb-6">
        EQUIPPING CHAMPIONS
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
        {categories.map((item, index) => {
          const isClickable = item.link && item.link !== "#";
          
          const cardContent = (
            <div
              style={{
                backgroundImage:
                  "url(https://wallpapers.com/images/hd/white-texture-background-dsqck1aznlrzk1az.jpg)",
              }}
              className={`bg-center bg-cover bg-no-repeat rounded-t-full p-4 flex flex-col items-center justify-between transition-all duration-300 ${
                isClickable ? 'hover:scale-105 cursor-pointer' : ''
              } shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] h-full`}
            >
              <h3 className="text-center mt-10 mx-auto font-bold text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl w-[70%] sm:w-[65%] xl:w-[50%]">
                {item.name}
              </h3>

              <img
                src={item.image}
                alt={item.name}
                className="w-3/4 md:w-2/3 lg:w-1/2 object-contain my-4 transition-transform duration-300 group-hover:scale-110"
              />

              <div className="text-left w-full">
                <p className="text-xs md:text-sm lg:text-xl font-semibold">
                  Starting From
                </p>
                <p className="text-blue-600 text-lg md:text-2xl lg:text-3xl xl:text-6xl font-bold italic">
                  ₹{item.subtitle}
                </p>
              </div>

              {isClickable && (
                <div className="mt-2 text-xs md:text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now →
                </div>
              )}
            </div>
          );

          return (
            <div
              key={index}
              className={`group ${isClickable ? 'cursor-pointer' : ''}`}
            >
              {isClickable ? (
                <Link to={item.link} className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-full">
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SportsCategorySection;