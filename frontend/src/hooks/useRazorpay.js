import { useCallback, useEffect, useState } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Razorpay SDK');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const openCheckout = useCallback((options) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const rzp = new window.Razorpay({
        ...options,
        handler: (response) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
          escape: true,
          animation: true,
        },
      });

      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error.description || 'Payment failed'));
      });

      rzp.open();
    });
  }, []);

  return {
    isLoaded,
    error,
    openCheckout,
  };
};

export default useRazorpay;
