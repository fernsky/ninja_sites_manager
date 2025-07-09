import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectMultipleProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  maxValues?: number;
  className?: string;
  disabled?: boolean;
}

export function SelectMultiple({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search items...",
  emptyMessage = "No items found.",
  loading = false,
  maxValues,
  className,
  disabled = false,
}: SelectMultipleProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Ensure value is always an array
  const selectedValues = value ?? [];

  // Rest of filtering logic
  const filteredOptions = React.useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  const handleToggle = (optionValue: string) => {
    const newValue = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : maxValues && selectedValues.length >= maxValues
        ? selectedValues
        : [...selectedValues, optionValue];
    onChange(newValue);
  };

  const handleUnselect = (optionValue: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selectedValues.filter((v) => v !== optionValue));
  };

  return (
    <Popover open={disabled ? false : open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "min-h-[40px] w-full justify-between",
            selectedValues.length > 0 ? "h-full" : "h-10",
            className,
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedValues.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selectedValues.map((v) => {
              const option = options.find((opt) => opt.value === v);
              return (
                <Badge
                  variant="secondary"
                  key={v}
                  className="mb-1 mr-1 gap-1 pr-0.5"
                >
                  {option?.icon && <span className="mr-1">{option.icon}</span>}
                  {option?.label}
                  <button
                    className="ml-1 rounded-sm opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleUnselect(v, e);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <ScrollArea className="max-h-60">
            <CommandEmpty className="py-6 text-center text-sm">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleToggle(option.value)}
                    disabled={Boolean(
                      option.disabled ||
                        (maxValues &&
                          selectedValues.length >= maxValues &&
                          !isSelected),
                    )}
                    className="gap-2"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    {option.icon && <span>{option.icon}</span>}
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
