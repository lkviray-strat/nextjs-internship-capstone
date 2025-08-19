import { FileX2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh)] -mt-16 w-full">
      <div className="flex w-[370px] items-center justify-center flex-col gap-7 p-3">
        <FileX2 className="size-50 text-muted-foreground" />
        <div className="flex items-center justify-center flex-col gap-2 text-center">
          <h1 className="text-muted-foreground text-[24px] sm:text-[28px] font-semibold italic">
            404 Page Not Found :/
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
