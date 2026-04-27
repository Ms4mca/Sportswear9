import React from "react";
import { Briefcase, Rocket, HeartHandshake, Star } from "lucide-react";

const Careers = () => {
  return (
    <div className="w-full bg-gray-50 my-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-5">
          Careers at SportsWear9
        </h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Join a growing team shaping the future of sportswear in India.
          We’re looking for passionate, creative, and hardworking people.
        </p>

        {/* Why Work With Us */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <CareerCard
            icon={<Rocket size={40} className="mx-auto" />}
            title="Fast Growth Environment"
            description="Work with a young, energetic team that encourages learning and innovation."
          />
          <CareerCard
            icon={<HeartHandshake size={40} className="mx-auto" />}
            title="Supportive Culture"
            description="We believe in teamwork, respect, and creating a positive workplace."
          />
          <CareerCard
            icon={<Star size={40} className="mx-auto" />}
            title="Make an Impact"
            description="Your work directly influences the experience of thousands of customers."
          />
        </div>

        {/* Open Roles */}
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6 text-gray-800">
            <Briefcase /> Current Openings
          </h2>

          <p className="text-gray-600 mb-6">
            We are always looking for talented individuals. Drop your resume and we’ll get in touch!
          </p>

          <div className="space-y-6">
            <JobCard
              title="Customer Support Executive"
              type="Full-Time"
              location="Remote / Chandigarh"
              description="Handle customer queries, returns, and product support."
            />

            <JobCard
              title="Social Media Manager"
              type="Part-Time"
              location="Remote"
              description="Create engaging posts, reels, and campaigns for SportsWear9."
            />

            <JobCard
              title="Product Photographer"
              type="Contract"
              location="On-Site"
              description="Capture high-quality product photos for website and ads."
            />

            <div className="bg-gray-100 p-5 rounded-xl text-gray-700">
              Didn’t find a perfect role?  
              <strong> You can still apply!</strong>  
              <p className="mt-1">Send your CV to:  
                <span className="font-semibold"> careers@sportswear9.com</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* Reusable Components */

const CareerCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition">
    {icon}
    <h3 className="font-semibold text-gray-800 mt-3">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
);

const JobCard = ({ title, type, location, description }) => (
  <div className="p-6 border rounded-xl hover:bg-gray-50 transition">
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500">{type} • {location}</p>
    <p className="text-gray-700 mt-2">{description}</p>
  </div>
);

export default Careers;
