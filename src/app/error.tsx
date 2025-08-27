"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { BackgroundGlow } from "../components/background-glow";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      <BackgroundGlow />
      <div className="flex w-[500px] items-center justify-center -mt-8 flex-col gap-7 p-3">
        <AlertCircle className="size-50 text-red-600" />
        <div className="flex items-center justify-center flex-col gap-2 text-center">
          <h1 className="text-red-600 text-[24px] sm:text-[28px] font-semibold italic">
            Error: Something went wrong!
          </h1>
          <p className="text-muted-foreground text-[18px] sm:text-[19px]">
            If you think this is a mistake, please contact the eStratify
            support.
          </p>
        </div>
      </div>
    </div>
  );
}
