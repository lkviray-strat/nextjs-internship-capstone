import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "./ui/tooltip";

type TooltipHoverProps = {
  content: string;
  children: React.ReactNode;
};

export function TooltipHover({ content, children }: TooltipHoverProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="inline">{children}</TooltipTrigger>
      <TooltipContent
        align="start"
        side="bottom"
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
