import React from "react";
import { Sparkles, Target, Users, Trophy } from "lucide-react";

const OurStory = () => {
  return (
    <div className="w-full bg-gray-50 my-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-5">
          Who We Are – SportsWear9
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          SportsWear9 is built for athletes, dreamers, and everyone who believes in the power of movement.
          Our mission is simple — to deliver premium sportswear that makes you feel confident, comfortable,
          and unstoppable.
        </p>

        {/* Story Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <Sparkles /> Our Story
          </h2>
          <p className="text-gray-700 leading-relaxed">
            SportsWear9 started with a vision: to bring quality activewear to everyone at affordable prices.
            What began as a small idea has now grown into a brand trusted for comfort, style, and performance.  
            Whether you're hitting the gym, running outdoors, or simply living an active lifestyle —  
            we design products that move with you.  
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <Target /> Our Mission
          </h2>
          <p className="text-gray-700">
            To inspire confidence through high-quality, affordable sportswear that supports every body type,  
            every lifestyle, and every fitness level.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <Trophy /> Our Vision
          </h2>
          <p className="text-gray-700">
            We aim to become India's most trusted sportswear brand by focusing on comfort, durability,
            and innovative designs.
          </p>
        </div>

        {/* Community */}
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <Users /> Our Community
          </h2>
          <p className="text-gray-700">
            From athletes to beginners, our community inspires us every day.  
            SportsWear9 isn’t just a brand — it’s a movement.  
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
