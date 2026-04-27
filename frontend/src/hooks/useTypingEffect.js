import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for typing animation in search bar placeholder
 * @param {string[]} suggestions - Array of suggestion strings to cycle through
 * @param {Object} options - Configuration options
 * @param {number} options.typingSpeed - Milliseconds per character when typing (default: 80)
 * @param {number} options.erasingSpeed - Milliseconds per character when erasing (default: 40)
 * @param {number} options.pauseDuration - Pause after complete word before erasing (default: 1200)
 * @param {number} options.startDelay - Initial delay before animation starts (default: 2000)
 * @param {number} options.betweenDelay - Delay between words (default: 500)
 */
const useTypingEffect = (suggestions = [], options = {}) => {
  const {
    typingSpeed = 180,     // was 100
    erasingSpeed = 100,    // was 50
    pauseDuration = 1500,  // small increase
    startDelay = 2000,
    betweenDelay = 700,    // small increase
  } = options;

  const [placeholder, setPlaceholder] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  
  const suggestionIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef(null);

  const clearAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const eraseSuggestion = useCallback(() => {
    if (!isAnimating || suggestions.length === 0) return;

    const current = suggestions[suggestionIndexRef.current];
    charIndexRef.current--;
    setPlaceholder(current.slice(0, charIndexRef.current));

    if (charIndexRef.current > 0) {
      timeoutRef.current = setTimeout(eraseSuggestion, erasingSpeed);
    } else {
      // Move to next suggestion
      suggestionIndexRef.current = (suggestionIndexRef.current + 1) % suggestions.length;
      timeoutRef.current = setTimeout(() => {
        typeSuggestion();
      }, betweenDelay);
    }
  }, [isAnimating, suggestions, erasingSpeed, betweenDelay]);

  const typeSuggestion = useCallback(() => {
    if (!isAnimating || suggestions.length === 0) return;

    const current = suggestions[suggestionIndexRef.current];
    charIndexRef.current++;
    setPlaceholder(current.slice(0, charIndexRef.current));

    if (charIndexRef.current < current.length) {
      timeoutRef.current = setTimeout(typeSuggestion, typingSpeed);
    } else {
      // Pause then erase
      timeoutRef.current = setTimeout(eraseSuggestion, pauseDuration);
    }
  }, [isAnimating, suggestions, typingSpeed, pauseDuration, eraseSuggestion]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    clearAnimation();
    setPlaceholder('');
  }, [clearAnimation]);

  const startAnimation = useCallback(() => {
    if (hasInput || isFocused) return;
    
    setIsAnimating(true);
    charIndexRef.current = 0;
    // Start typing immediately when animation starts
    typeSuggestion();
  }, [hasInput, isFocused, typeSuggestion]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    stopAnimation();
  }, [stopAnimation]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!hasInput) {
      timeoutRef.current = setTimeout(startAnimation, betweenDelay);
    }
  }, [hasInput, betweenDelay, startAnimation]);

  // Handle input change
  const handleInputChange = useCallback((value) => {
    const hasValue = value.trim() !== '';
    setHasInput(hasValue);
    if (isAnimating) {
      stopAnimation();
    }
  }, [isAnimating, stopAnimation]);

  // Initial start
  useEffect(() => {
    if (suggestions.length === 0) return;

    const initialTimeout = setTimeout(() => {
      if (!hasInput && !isFocused) {
        setIsAnimating(true);
      }
    }, startDelay);

    return () => {
      clearTimeout(initialTimeout);
      clearAnimation();
    };
  }, [suggestions.length, startDelay, clearAnimation]);

  // Start typing when isAnimating becomes true
  useEffect(() => {
    if (isAnimating && !isFocused && !hasInput) {
      charIndexRef.current = 0;
      typeSuggestion();
    }
  }, [isAnimating, isFocused, hasInput, typeSuggestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAnimation();
  }, [clearAnimation]);

  return {
    placeholder,
    isAnimating,
    handleFocus,
    handleBlur,
    handleInputChange,
    stopAnimation,
    startAnimation,
  };
};

export default useTypingEffect;
