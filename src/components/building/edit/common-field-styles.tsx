export const fieldStyles = {
  label: "text-sm font-medium text-foreground/90",
  input:
    "transition-all hover:border-primary focus-visible:ring-1 focus-visible:ring-primary",
  select:
    "transition-all hover:border-primary focus-visible:ring-1 focus-visible:ring-primary",
  combobox:
    "w-full transition-all hover:border-primary focus-visible:ring-1 focus-visible:ring-primary",
  gridContainer: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
};

export interface SectionProps {
  form: any;
  icon?: React.ReactNode;
  className?: string;
}
