import { useCallback, useRef } from "react";

export const useSmoothScroll = () => {
  const animationRef = useRef<number | null>(null);

  const cancelScroll = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const easeInOutCubic = useCallback((t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  const smoothScroll = useCallback(
    (from: number, to: number, duration: number = 500): Promise<void> => {
      cancelScroll();

      return new Promise((resolve) => {
        if (from === to) {
          resolve();
          return;
        }

        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeInOutCubic(progress);

          const currentPosition = from + (to - from) * easedProgress;

          window.scrollTo(0, currentPosition);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateScroll);
          } else {
            animationRef.current = null;
            resolve();
          }
        };

        animationRef.current = requestAnimationFrame(animateScroll);
      });
    },
    [cancelScroll, easeInOutCubic]
  );

  const scrollToTop = useCallback(
    async (duration?: number): Promise<void> => {
      const from = window.scrollY || document.documentElement.scrollTop;

      if (from === 0) return;

      await smoothScroll(from, 0, duration);
    },
    [smoothScroll]
  );

  return {
    scrollToTop,
    cancelScroll,
  };
};
