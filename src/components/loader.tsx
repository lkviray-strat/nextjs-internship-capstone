import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-11rem)] -mt-16 w-full">
      <Loader2 className="animate-spin size-20 text-muted-foreground" />
    </div>
  );
}
