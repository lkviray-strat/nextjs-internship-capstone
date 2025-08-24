"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import {
  cn,
  getColorFromHash,
  getContent,
  stringToHash,
} from "@/src/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        "outline outline-offset-[-1px] outline-border/50", // Crisp edge
        "ring-1 ring-inset ring-border/20", // Additional anti-aliasing
        "isolate", // Prevents bleeding
        className
      )}
      style={{
        transform: "translateZ(0)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  content?: string;
}

function AvatarFallback({
  className,
  content = "",
  children,
  ...props
}: AvatarFallbackProps) {
  const backgroundColor = React.useMemo(() => {
    if (!content) return "var(--muted)";
    const hash = stringToHash(content);
    return getColorFromHash(hash);
  }, [content]);

  const initials = React.useMemo(() => {
    if (!content) return children;
    return getContent(content);
  }, [content, children]);

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        className
      )}
      style={{ backgroundColor }}
      {...props}
    >
      {initials}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
