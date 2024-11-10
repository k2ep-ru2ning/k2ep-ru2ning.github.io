import { useEffect, useState } from "react";

const IS_SERVER = typeof window === "undefined";

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (IS_SERVER) {
      return false;
    }

    const mediaQueryList = window.matchMedia(query);
    return mediaQueryList.matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent): void => {
      setMatches(e.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
