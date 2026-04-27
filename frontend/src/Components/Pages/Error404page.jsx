import React from "react";
import { Link } from "react-router-dom";
import { Home, HelpCircle, ArrowRight } from "lucide-react";

const Error404Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16 mt-16 md:mt-20">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-black text-gray-900 tracking-tighter">
            404
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-6 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-500">Commitment</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">0 Excuses</div>
            <div className="text-sm text-gray-500">No Limits</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group">
              <Home className="w-5 h-5" />
              Return Home
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          
          <Link to="/contact" className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-xl font-bold text-lg transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Get Help
            </button>
          </Link>
        </div>

        {/* Footer text */}
        <p className="mt-10 text-sm text-gray-400">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  );
};

export default Error404Page;
