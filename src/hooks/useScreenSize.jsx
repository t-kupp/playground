"use client";

import { useEffect, useState } from "react";

export default function useScreenSize() {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    function handleResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, height };
}
