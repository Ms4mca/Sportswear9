import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PromotionCard = ({ image, deal, look, logo, link = "#" }) => {
    const isClickable = link && link !== "#";

    const cardContent = (
        <div className="relative w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] flex-shrink-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white border-2 border-gray-200">
            <div className="relative h-[380px] sm:h-[420px] md:h-[450px] overflow-hidden">
                <img
                    src={image}
                    alt={deal}
                    className={`w-full h-full object-cover ${
                        isClickable ? 'hover:scale-105' : ''
                    } transition-transform duration-500`}
                />
                <div className="pointer-events-none absolute inset-3 border-4 border-dashed text-white"></div>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow-lg uppercase">
                        {deal}
                    </p>
                </div>
                <div className="absolute bottom-0 w-full bg-white py-1 flex items-center justify-center">
                    <p className="text-black text-base sm:text-lg drop-shadow-md mt-1">
                        {look}
                    </p>
                </div>
            </div>
            {isClickable && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            )}
        </div>
    );

    return isClickable ? (
        <Link to={link} className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg">
            {cardContent}
        </Link>
    ) : (
        cardContent
    );
};

const DealsOfTheDay = ({ title, items }) => {
    const scrollRef = useRef(null);

    const scrollBy = (amount) => {
        if (scrollRef.current) {
            const scrollDistance = scrollRef.current.clientWidth * amount;
            scrollRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
        }
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Title */}
            {title && (
                <div className="mb-6">
                    <h2 className="font-bold uppercase text-base md:text-xl text-foreground">
                        {title}
                    </h2>
                </div>
            )}

            <div className="relative">
                {/* Left Scroll */}
                <button
                    onClick={() => scrollBy(-0.8)}
                    className="absolute -left-2 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hidden sm:flex hover:scale-105 border border-gray-200 transition-all z-40"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="text-gray-700 w-6 h-6" />
                </button>

                {/* Cards Row */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide pb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {items.map((item, index) => (
                        <div key={index} className="flex-shrink-0 snap-start">
                            <PromotionCard
                                image={item.image}
                                deal={item.title || item.deal}
                                look={item.title || item.look}
                                logo={item.title || item.logo}
                                link={item.link || "#"}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Scroll */}
                <button
                    onClick={() => scrollBy(0.8)}
                    className="absolute -right-2 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hidden sm:flex hover:scale-105 border border-gray-200 transition-all"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="text-gray-700 w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export { PromotionCard, DealsOfTheDay };