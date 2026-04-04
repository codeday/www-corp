import { useReducer, useEffect } from "react";

export function useSlideshow(length: number, duration: number): number {
  const [i, next] = useReducer((c: number) => (c + 1) % length, 0);

  useEffect(() => {
    if (typeof window === "undefined" || length === 0 || duration === 0) return;
    const interval = setInterval(next, duration);
    return () => clearInterval(interval);
  }, [typeof window, i, length, duration]);

  return i;
}
