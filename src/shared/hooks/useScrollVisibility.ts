import { useState, useEffect, useCallback } from "react";

export const useScrollVisibility = (threshold: number = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateVisibility = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );

    setIsVisible(scrollY > threshold);
    setScrollProgress(maxScroll > 0 ? scrollY / maxScroll : 0);
  }, [threshold]);

  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    rafId = requestAnimationFrame(() => {
      updateVisibility();
      rafId = null;
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateVisibility]);

  return { isVisible, scrollProgress };
};
