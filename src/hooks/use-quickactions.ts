import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useQuickActions(
  onMatch: (open: boolean) => void,
  key = "modal",
  value = "create",
  delay = 1000
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue === value) {
      const timer = setTimeout(() => {
        onMatch(true);
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        router.replace(`${pathname}?${params.toString()}`);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [key, value, delay, pathname, router, searchParams, onMatch]);
}
