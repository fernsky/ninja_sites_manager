import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  fieldStyles,
  SectionProps,
} from "@/components/building/edit/common-field-styles";
import { FormCard } from "./form-card";

export function BasicInformationSection({
  form,
  icon,
  className,
}: SectionProps) {
  return (
    <FormCard
      title="Basic Information"
      description="General information about the building"
      icon={icon}
      className={className}
    >
      <div className={fieldStyles.gridContainer}>
        <FormField
          control={form.control}
          name="locality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldStyles.label}>Locality</FormLabel>
              <FormControl>
                <Input {...field} className={fieldStyles.input} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
}
