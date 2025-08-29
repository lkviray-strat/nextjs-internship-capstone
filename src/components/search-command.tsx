import { useEffect, useRef, useState } from "react";
import { useClickAway } from "../hooks/use-clickaway";
import { cn } from "../lib/utils";
import { Command, CommandEmpty, CommandInput, CommandList } from "./ui/command";

interface CommandSearchProps<T> {
  items: T[];
  isLoading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onItemSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  fallback?: React.ReactNode;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  limit?: number;
  selectedItems?: string[];
  onClear?: () => void;
}

export function CommandSearch<T>({
  items,
  isLoading,
  searchTerm,
  onSearchChange,
  onItemSelect,
  renderItem,
  fallback = <div>Loading...</div>,
  placeholder = "Search...",
  emptyText = "No items found",
  className,
  limit = Infinity,
  selectedItems = [],
}: CommandSearchProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // store refs for each item
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleItemSelect = (item: T) => {
    if (selectedItems.length >= limit) return;
    onItemSelect(item);
    onSearchChange("");
    setOpen(false);
    setHighlightedIndex(-1);
  };

  useClickAway(ref, () => {
    setOpen(false);
    setIsFocused(false);
    setHighlightedIndex(-1);
  });

  // auto scroll highlighted into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  const isAtLimit = selectedItems.length >= limit;

  return (
    <div
      ref={ref}
      onMouseDown={() => {
        ref.current?.focus();
      }}
      className={cn(
        "relative w-full rounded-md bg-popover",
        isFocused ? "border-ring ring-ring/50 ring-[3px]" : "",
        className
      )}
    >
      <Command className="border">
        <CommandInput
          tabIndex={0}
          placeholder={placeholder}
          value={searchTerm}
          disabled={isAtLimit}
          onFocus={() => {
            setIsFocused(true);
            if (searchTerm.length > 0) setOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onValueChange={(val) => {
            onSearchChange(val);
            setOpen(val.length > 0);
            setHighlightedIndex(-1);
          }}
          onKeyDown={(e) => {
            if (!open) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev < items.length - 1 ? prev + 1 : 0
              );
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : items.length - 1
              );
            }
            if (e.key === "Enter" && highlightedIndex >= 0) {
              e.preventDefault();
              handleItemSelect(items[highlightedIndex]);
            }
            if (e.key === "Escape") {
              setOpen(false);
              setHighlightedIndex(-1);
            }
          }}
        />

        {open && (
          <>
            {isLoading ? (
              <CommandList
                className="
                  absolute left-0 top-11 w-full
                  max-h-64 overflow-y-auto rounded-md border 
                  bg-popover text-popover-foreground shadow-md z-100
                "
              >
                {fallback}
              </CommandList>
            ) : (
              <>
                {items.length > 0 ? (
                  <CommandList
                    onSelect={(e) => e.preventDefault()}
                    className="
                      absolute left-0 top-11 w-full
                      max-h-64 overflow-y-auto rounded-md border 
                      bg-popover text-popover-foreground shadow-md z-100
                    "
                  >
                    {items.map((item, idx) => (
                      <div
                        key={JSON.stringify(item)}
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemSelect(item);
                        }}
                        className={cn(
                          "px-4 py-2.5 rounded-sm cursor-pointer",
                          highlightedIndex === idx
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent"
                        )}
                      >
                        {renderItem(item)}
                      </div>
                    ))}
                  </CommandList>
                ) : (
                  <CommandEmpty
                    className="
                  absolute left-0 top-11 w-full
                  max-h-64 overflow-y-auto rounded-md border 
                  bg-popover text-popover-foreground shadow-md z-100
                  flex items-center justify-center p-3
                "
                  >
                    {emptyText}
                  </CommandEmpty>
                )}
              </>
            )}
          </>
        )}
      </Command>
    </div>
  );
}
