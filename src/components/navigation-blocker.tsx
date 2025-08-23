// components/NavigationBlocker.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface NavigationBlockerProps {
  block: boolean;
  message?: string;
}

export const NavigationBlocker: React.FC<NavigationBlockerProps> = ({
  block,
  message = "You have unsaved changes. Are you sure you want to leave?",
}) => {
  const router = useRouter();
  const isBlockedRef = useRef(block);

  useEffect(() => {
    isBlockedRef.current = block;
  }, [block]);

  useEffect(() => {
    if (!block) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isBlockedRef.current) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!isBlockedRef.current) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("//")) {
          if (!window.confirm(message)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        }
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!isBlockedRef.current) return;

      if (!window.confirm(message)) {
        // Prevent navigation
        e.preventDefault();

        // Restore the current URL
        window.history.pushState(null, "", window.location.href);

        // This is a more aggressive approach to stop the navigation
        const currentState = window.history.state;
        window.history.replaceState(currentState, "");
      }
    };

    // Store original methods
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    // Override router methods
    router.push = (...args: Parameters<typeof originalPush>) => {
      if (isBlockedRef.current && !window.confirm(message)) {
        return Promise.resolve(false);
      }
      return originalPush.apply(router, args);
    };

    router.replace = (...args: Parameters<typeof originalReplace>) => {
      if (isBlockedRef.current && !window.confirm(message)) {
        return Promise.resolve(false);
      }
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      if (isBlockedRef.current && !window.confirm(message)) {
        return Promise.resolve(false);
      }
      return originalBack.apply(router);
    };

    router.forward = () => {
      if (isBlockedRef.current && !window.confirm(message)) {
        return Promise.resolve(false);
      }
      return originalForward.apply(router);
    };

    // Add a state to the history to help with back button handling
    window.history.pushState({ isBlocked: true }, "");

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);

      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;

      // Clean up history state if needed
      if (window.history.state?.isBlocked) {
        window.history.back();
      }
    };
  }, [block, message, router]);

  return null;
};
