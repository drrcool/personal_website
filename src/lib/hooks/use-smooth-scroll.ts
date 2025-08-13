import { useCallback, useEffect, useState } from "react";

export const useSmoothScroll = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!isMounted) {
        console.log("Not mounted yet, skipping scroll");
        return;
      }

      console.log(`Attempting to scroll to section: ${sectionId}`);

      const element = document.getElementById(sectionId);
      if (element) {
        console.log(`Found element, scrolling to:`, element);
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      } else {
        console.log(`Element with id "${sectionId}" not found`);
        // Try to find by partial match
        const allSections = document.querySelectorAll("section[id]");
        console.log(
          "Available section IDs:",
          Array.from(allSections).map((s) => s.id)
        );
      }
    },
    [isMounted]
  );

  return { scrollToSection, isMounted };
};
