import { useEffect, useState, type ComponentType } from "react";

export function DevExpressions() {
  const [Screen, setScreen] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }
    void import("./ExpressionsScreen.tsx").then((mod) => {
      setScreen(() => mod.ExpressionsScreen);
    });
  }, []);

  if (!import.meta.env.DEV || Screen === null) {
    return null;
  }
  const Gallery = Screen;
  return <Gallery />;
}
