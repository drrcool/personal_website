import { useCallback, useEffect, useState } from "react";

export const useSmoothScroll = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!isMounted) return;

      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    },
    [isMounted]
  );

  return { scrollToSection, isMounted };
};
