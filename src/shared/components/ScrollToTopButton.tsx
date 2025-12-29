import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollVisibility } from "../hooks/useScrollVisibility";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

export function ScrollToTopButton() {
  const [isScrolling, setIsScrolling] = useState(false);
  const { isVisible, scrollProgress } = useScrollVisibility(300);
  const { scrollToTop, cancelScroll } = useSmoothScroll();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      cancelScroll();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cancelScroll]);

  const handleScrollToTop = async () => {
    if (isScrolling) return;

    try {
      setIsScrolling(true);
      cancelScroll();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      await scrollToTop(100);
    } catch (error) {
      console.error("Erro no scroll:", error);
      window.scrollTo(0, 0);
    } finally {
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    }
  };

  const circumference = 283;
  const strokeOffset = circumference - scrollProgress * circumference;

  return (
    <button
      onClick={handleScrollToTop}
      aria-label="Voltar ao topo"
      disabled={isScrolling}
      className={`
        fixed bottom-6 right-6 p-3 rounded-full
        bg-linear-to-br from-blue-600 to-purple-600 text-white
        shadow-xl hover:shadow-2xl transition-all duration-200 z-50
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }
        ${isScrolling ? "scale-95" : "hover:-translate-y-1"}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      style={{
        transition:
          "opacity 150ms ease-out, transform 150ms ease-out, box-shadow 200ms ease-out",
      }}
    >
      <ChevronUp
        className={`w-6 h-6 transition-transform ${
          isScrolling ? "animate-bounce" : ""
        }`}
      />

      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          style={{ transition: "stroke-dashoffset 100ms linear" }}
        />
      </svg>
    </button>
  );
}
