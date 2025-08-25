import {
  cn,
  getColorFromHash,
  getContent,
  stringToHash,
} from "@/src/lib/utils";
import type { AvatarFallbackProps } from "@radix-ui/react-avatar";
import { useMemo } from "react";

export function ProjectAvatar({
  className,
  content = "",
  children,
  ...props
}: AvatarFallbackProps) {
  const backgroundColor = useMemo(() => {
    if (!content) return "var(--muted)";
    const hash = stringToHash(content);
    return getColorFromHash(hash);
  }, [content]);

  const initials = useMemo(() => {
    if (!content) return children;
    return getContent(content);
  }, [content, children]);

  return (
    <div
      className={cn(
        "flex shadow-2xl size-full text-white items-center justify-center rounded-lg",
        className
      )}
      style={{ backgroundColor }}
      {...props}
    >
      {initials}
    </div>
  );
}
