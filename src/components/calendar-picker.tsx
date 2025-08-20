import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cloneElement, isValidElement, type ReactNode, useState } from "react";
import { type PropsSingle } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type CalendarPickerProps = {
  formatStr: string;
  children: React.ReactNode;
  disabled?: (date: Date) => boolean;
  ref?: React.Ref<HTMLInputElement>;
};

export function CalendarPicker({
  formatStr,
  children,
  disabled,
  value,
  onChange,
}: CalendarPickerProps & { value?: Date; onChange?: (date: Date) => void }) {
  const [inputValue, setInputValue] = useState(
    value ? format(value, formatStr) : ""
  );
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsed = parse(e.target.value, formatStr, new Date());
    if (!isNaN(parsed.getTime()) && onChange) {
      onChange(parsed);
    }
  };

  const handleSelect = (selectedDate?: Date) => {
    if (!selectedDate) return;

    setInputValue(format(selectedDate, formatStr));
    if (onChange) onChange(selectedDate);
    setSelectorOpen(false);
  };

  const cloneChildWithProps = (child: ReactNode, index: number) => {
    if (!isValidElement(child)) return child;

    if (child.type === Input) {
      return cloneElement(
        child as React.ReactElement<React.ComponentProps<typeof Input>>,
        {
          key: index,
          value: inputValue,
          onChange: handleInputChange,
        }
      );
    }

    if (child.type === Calendar) {
      return (
        <Popover
          key={index}
          open={selectorOpen}
          onOpenChange={setSelectorOpen}
          modal
        >
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="end"
          >
            {cloneElement(child, {
              mode: "single",
              selected: value,
              onSelect: handleSelect,
              disabled,
            } as PropsSingle)}
          </PopoverContent>
        </Popover>
      );
    }

    return cloneElement(child, { key: index });
  };

  return (
    <div className="flex items-center">
      {Array.isArray(children)
        ? children.map(cloneChildWithProps)
        : cloneChildWithProps(children, 0)}
    </div>
  );
}
