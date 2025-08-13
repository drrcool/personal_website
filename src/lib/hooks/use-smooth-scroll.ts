import { useCallback, useEffect, useState } from "react";

export const useSmoothScroll = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!isMounted) return;

      try {
        const element = document.getElementById(sectionId);
        if (element) {
          // Try smooth scrolling first
          if ("scrollBehavior" in document.documentElement.style) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          } else {
            // Fallback for browsers that don't support smooth scrolling
            element.scrollIntoView();
          }
        } else {
          // Fallback: try to find by partial match or scroll to top
          console.warn(`Section "${sectionId}" not found, scrolling to top`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (error) {
        console.error("Smooth scroll failed:", error);
        // Ultimate fallback: just scroll to top
        window.scrollTo(0, 0);
      }
    },
    [isMounted]
  );

  return { scrollToSection, isMounted };
};
