import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCard } from "./form-card";
import { UseFormReturn } from "react-hook-form";
import { buildingChoices } from "@/lib/resources/building";
import { fieldStyles, SectionProps } from "./common-field-styles";

export function AccessibilitySection({ form, icon, className }: SectionProps) {
  return (
    <FormCard
      title="Accessibility"
      description="Time distances to various facilities"
      icon={icon}
      className={className}
    >
      <div className={fieldStyles.gridContainer}>
        {[
          "timeToMarket",
          "timeToActiveRoad",
          "timeToPublicBus",
          "timeToHealthOrganization",
          "timeToFinancialOrganization",
        ].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={fieldStyles.label}>
                  {fieldName
                    .replace("timeTo", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={fieldStyles.select}>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(buildingChoices.time).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </FormCard>
  );
}
