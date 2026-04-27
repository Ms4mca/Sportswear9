import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const placeholders = [
  "running shoes...",
  "your perfect sportswear...",
  "trending styles...",
  "athletic wear...",
  "latest collections...",
];

const SearchBar = ({ 
  initialValue = "", 
  onSubmit, 
  onClear,
  className = "",
  placeholder = "Search for products...",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync with initialValue prop when it changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Animated placeholder effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        event.target !== inputRef.current
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(searchTerm);
    } else {
      // Default behavior - navigate to categories page with search query
      if (searchTerm.trim()) {
        navigate(`/categories?q=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate('/categories');
      }
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onClear) {
      onClear();
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    if (onSubmit) {
      onSubmit(suggestion);
    } else {
      navigate(`/categories?q=${encodeURIComponent(suggestion)}`);
    }
    setShowSuggestions(false);
  };

  // Popular search suggestions
  const popularSuggestions = [
    "Running Shoes",
    "Yoga Mats",
    "Gym Wear",
    "Sports Equipment",
    "Fitness Trackers",
    "Water Bottles",
    "Workout Apparel",
    "Training Gear"
  ];

  // Recent searches (could be from localStorage)
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updatedSearches = [
      term,
      ...searches.filter(s => s !== term)
    ].slice(0, 5); // Keep only last 5 searches
    
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <>
      <style>{`
        @keyframes placeholderFade {
          0% { opacity: 0; transform: translateY(-5px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(5px); }
        }
        .placeholder-animate::placeholder {
          animation: placeholderFade 3s ease-in-out;
        }
      `}</style>
      
      <div className={`relative ${className}`}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder || `Search for ${placeholders[currentPlaceholder]}`}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900 placeholder-animate transition-all duration-200 hover:border-gray-400"
            />
            
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>

            {/* Clear Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchTerm && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="py-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <>
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</h3>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 group"
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700 group-hover:text-blue-600">{search}</span>
                    </button>
                  ))}
                  <div className="border-t my-2"></div>
                </>
              )}

              {/* Popular Suggestions */}
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular Searches</h3>
              </div>
              {popularSuggestions
                .filter(suggestion => 
                  suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 5)
                .map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 group"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <span className="text-gray-700 group-hover:text-blue-600">{suggestion}</span>
                  </button>
                ))}

              {/* Current Search Term */}
              {searchTerm.trim() && (
                <button
                  onClick={() => {
                    saveRecentSearch(searchTerm);
                    handleSubmit({ preventDefault: () => {} });
                  }}
                  className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 flex items-center gap-3 border-t border-blue-100"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  <span className="font-medium text-blue-700">
                    Search for "{searchTerm}"
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;