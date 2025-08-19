import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  type ChangeEvent,
  cloneElement,
  isValidElement,
  type ReactNode,
  useState,
} from "react";
import { DayPicker, type PropsSingle } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type CalendarPickerProps = {
  formatStr: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
};

export function CalendarPicker({
  formatStr,
  children,
  ref,
}: CalendarPickerProps) {
  const [date, setDate] = useState<Date>();
  const [inputValue, setInputValue] = useState<string>("");
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  const handleDateEntry = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setDate(parse(e.target.value, formatStr, new Date()));
    setSelectorOpen(false);
  };

  const handleDateSelection: PropsSingle["onSelect"] = (date) => {
    if (date) {
      setDate(date);
      setInputValue(format(date, formatStr));
    }
    setSelectorOpen(false);
  };

  const cloneChildWithProps = (child: ReactNode, index: number) => {
    if (isValidElement(child)) {
      if (child.type === Input) {
        return cloneElement(child, {
          key: index,
          value: inputValue,
          onChange: handleDateEntry,
          className: "rounded-r-none",
          ref: ref,
        } as React.ComponentProps<"input">);
      }

      if (child.type === Calendar) {
        return (
          <Popover
            key={index}
            open={selectorOpen}
            onOpenChange={setSelectorOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-l-none border border-l-0"
              >
                <CalendarIcon className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="end"
            >
              {cloneElement(child, {
                mode: "single",
                selected: date,
                onSelect: handleDateSelection,
                defaultMonth: date,
              } as React.ComponentProps<typeof DayPicker>)}
            </PopoverContent>
          </Popover>
        );
      }

      return cloneElement(child, { key: index });
    }
    return child;
  };

  return (
    <div className="flex items-center">
      {Array.isArray(children)
        ? children.map((child, index) => cloneChildWithProps(child, index))
        : cloneChildWithProps(children, 0)}
    </div>
  );
}
