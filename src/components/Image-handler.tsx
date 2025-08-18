"use client";

import Image from "next/image";
import { useState } from "react";

type ImageHandler = {
  imageUrl: string;
  title: string;
  fallbackUrl: string;
  className?: string;
};

export function ImageHandler({
  imageUrl,
  title,
  fallbackUrl,
  className,
}: ImageHandler) {
  const [image, setImage] = useState<string>(imageUrl);
  const [reveal, setReveal] = useState<boolean>(false);
  const loader = reveal ? "none" : "inline-block";

  return (
    <>
      <Image
        src={image}
        onError={() => {
          setReveal(true);
          setImage(fallbackUrl);
        }}
        onLoadingComplete={() => {
          setReveal(true);
        }}
        alt={title}
        fill
        className={`object-cover ${className}`}
      />
      <div
        className="animate-pulse bg-gray-400 w-full h-full absolute inset-0"
        style={{
          display: loader,
        }}
      >
        {" "}
      </div>
    </>
  );
}
