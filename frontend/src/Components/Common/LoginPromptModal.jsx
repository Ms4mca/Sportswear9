import { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, User } from 'lucide-react';

const LoginPromptModal = ({ onClose, onOpenAuth }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden animate-scale-in">
        {/* Decorative gradient circles */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-pink/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-purple/30 rounded-full blur-3xl"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="p-8 relative">
          {/* Icon group */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-primary/10 p-4 rounded-2xl animate-float">
              <ShoppingBag className="text-primary" size={32} />
            </div>
            <div className="bg-accent-pink/10 p-4 rounded-2xl animate-float" style={{ animationDelay: '0.2s' }}>
              <Heart className="text-accent-pink" size={32} />
            </div>
            <div className="bg-accent-purple/10 p-4 rounded-2xl animate-float" style={{ animationDelay: '0.4s' }}>
              <User className="text-accent-purple" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-3 gradient-text">
            Unlock Your Experience!
          </h2>
          
          <p className="text-center text-gray-600 mb-6 leading-relaxed">
            Sign in to save your favorites, track orders, and enjoy personalized recommendations just for you.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenAuth('login');
              }}
              className="w-full bg-gradient-primary text-white font-bold py-4 px-6 rounded-xl hover:shadow-glow-red transition-all duration-300 transform hover:scale-[1.02]"
            >
              Sign In
            </button>
            
            <button
              onClick={() => {
                onClose();
                onOpenAuth('signup');
              }}
              className="w-full bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              Create Account
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 font-medium py-2 hover:text-gray-700 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
