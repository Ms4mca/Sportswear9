import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const handleDisable = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div 
      role="dialog" 
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-4 px-6 z-[100] animate-fade-in-up"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm">
            We use cookies to track website performance.{' '}
            <span className="block sm:inline mt-1 sm:mt-0">
              View our{' '}
              <a 
                href="/privacy" 
                className="underline hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </a>{' '}
              for details.
            </span>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleEnable}
            className="bg-white text-gray-900 font-semibold py-2 px-6 rounded hover:bg-gray-100 transition-all duration-300"
          >
            Enable cookies
          </button>
          <button
            type="button"
            onClick={handleDisable}
            className="bg-transparent border-2 border-white text-white font-semibold py-2 px-6 rounded hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Disable cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
