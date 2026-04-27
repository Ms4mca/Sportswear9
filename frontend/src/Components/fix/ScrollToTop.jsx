import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Try multiple methods to ensure it works
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
      
      // Fallback methods
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Small delay to ensure page is rendered
    const timer = setTimeout(scrollToTop, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;