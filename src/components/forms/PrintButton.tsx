import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PrintButtonProps {
  icon: LucideIcon;
  label: string;
  onPrint: () => Promise<void>;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export const PrintButton = ({
  icon: Icon,
  label,
  onPrint,
  disabled = false,
  size = "default",
  variant = "default",
  className,
}: PrintButtonProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await onPrint();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      onClick={handlePrint}
      variant={variant}
      size="sm"
      className={cn(
        "h-8 px-2 text-xs gap-1 whitespace-nowrap",
        className,
        isPrinting || disabled ? "opacity-70 cursor-not-allowed" : "",
      )}
      disabled={isPrinting || disabled}
    >
      <Icon className={cn("h-3.5 w-3.5", isPrinting ? "animate-spin" : "")} />
      <span>{isPrinting ? "..." : label}</span>
    </Button>
  );
};
