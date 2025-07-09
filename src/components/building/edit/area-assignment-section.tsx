import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { FormCard } from "./form-card";
import { UseFormReturn } from "react-hook-form";
import { api } from "@/trpc/react";
import { fieldStyles, SectionProps } from "./common-field-styles";

interface AreaAssignmentSectionProps extends SectionProps {
  currentBuildingToken: string;
}

export function AreaAssignmentSection({
  form,
  currentBuildingToken,
  icon,
  className,
}: AreaAssignmentSectionProps) {
  const { data: areas } = api.area.getAreas.useQuery({
    status: "all",
  });

  const selectedAreaId = form.watch("areaId");
  const { data: areaTokens } = api.area.getAreaTokens.useQuery(
    { areaId: selectedAreaId },
    { enabled: !!selectedAreaId },
  );

  return (
    <FormCard
      title="Area Assignment"
      description="Assign building to an area and token"
      icon={icon}
      className={className}
    >
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="areaId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className={fieldStyles.label}>Area</FormLabel>
              <FormControl>
                <ComboboxSearchable
                  options={[
                    { value: "none", label: "None" },
                    ...(areas?.map((area) => ({
                      value: area.id,
                      label: `Area ${area.code} (Ward ${area.wardNumber})`,
                      searchTerms: [`${area.code}`, `${area.wardNumber}`],
                    })) ?? []),
                  ]}
                  value={field.value || "none"}
                  onChange={(value) => {
                    field.onChange(value === "none" ? "" : value);
                    form.setValue("buildingToken", "");
                  }}
                  placeholder="Search area..."
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buildingToken"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className={fieldStyles.label}>
                Building Token
              </FormLabel>
              <FormControl>
                <ComboboxSearchable
                  options={[
                    { value: "none", label: "None" },
                    ...(areaTokens?.tokens
                      ?.filter(
                        (token) =>
                          token.status === "unallocated" ||
                          token.token === currentBuildingToken,
                      )
                      .map((token) => ({
                        value: token.token,
                        label: `Token ${token.token}`,
                        searchTerms: [token.token],
                      })) ?? []),
                  ]}
                  value={field.value || "none"}
                  onChange={(value) =>
                    field.onChange(value === "none" ? "" : value)
                  }
                  placeholder="Search token..."
                  className="w-full"
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
