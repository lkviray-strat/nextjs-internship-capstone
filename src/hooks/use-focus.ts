import { useEffect } from "react";

export function useFocus(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;

    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [ref]);
}
