import { useEffect, useMemo, useState } from "react";
import { parseRoute, type Route } from "./parse-route.ts";

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
    };
  }, []);

  return useMemo(() => parseRoute(hash, import.meta.env.DEV), [hash]);
}
