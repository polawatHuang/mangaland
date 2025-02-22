import { useEffect, useState } from "react";

const useScrollPercentage = (elementId: string) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const updateScrollPercentage = () => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const { scrollTop, scrollHeight, clientHeight } = element;
      const maxScroll = scrollHeight - clientHeight;
      const scrolled = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollPercentage(scrolled);
    };

    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener("scroll", updateScrollPercentage);
      updateScrollPercentage(); // Initial calculation
    }

    return () => {
      if (element) element.removeEventListener("scroll", updateScrollPercentage);
    };
  }, []);

  return scrollPercentage;
};

export default useScrollPercentage;