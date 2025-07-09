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
import { SelectMultiple } from "@/components/ui/select-multiple";
import { MultiSelectCombobox } from "@/components/ui/multiselect-combobox";
import {
  fieldStyles,
  SectionProps,
} from "@/components/building/edit/common-field-styles";

interface BuildingDetailsSectionProps extends SectionProps {
  form: UseFormReturn<any>;
}

export function BuildingDetailsSection({
  form,
  icon,
  className,
}: SectionProps) {
  return (
    <FormCard
      title="Building Details"
      description="Physical characteristics of the building"
      icon={icon}
      className={className}
    >
      <div className={fieldStyles.gridContainer}>
        {[
          {
            name: "landOwnership",
            label: "Land Ownership",
            choices: Object.values(buildingChoices.land_ownership),
          },
          {
            name: "base",
            label: "Base",
            choices: Object.values(buildingChoices.house_base),
          },
          {
            name: "outerWall",
            label: "Outer Wall",
            choices: Object.values(buildingChoices.house_outer_wall),
          },
          {
            name: "roof",
            label: "Roof",
            choices: Object.values(buildingChoices.house_roof),
          },
          {
            name: "floor",
            label: "Floor",
            choices: Object.values(buildingChoices.house_floor),
          },
          {
            name: "mapStatus",
            label: "Map Status",
            choices: Object.values(buildingChoices.map_status),
          },
        ].map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={fieldStyles.label}>
                  {field.label}
                </FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={formField.value}
                >
                  <FormControl>
                    <SelectTrigger className={fieldStyles.select}>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.choices.map((value) => (
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
        <FormField
          control={form.control}
          name="naturalDisasters"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={fieldStyles.label}>
                Natural Disasters
              </FormLabel>
              <FormControl>
                <MultiSelectCombobox
                  label="Natural Disasters"
                  options={Object.values(buildingChoices.natural_disasters).map(
                    (value) => ({
                      value,
                      label: value,
                    }),
                  )}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Search natural disasters..."
                  renderItem={(option) => option.label}
                  renderSelectedItem={(values) => (
                    <span className="truncate">
                      {values.length === 0
                        ? "Select natural disasters..."
                        : values.length === 1
                          ? values[0]
                          : `${values.length} disasters selected`}
                    </span>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
}
