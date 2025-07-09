import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboboxSearchable } from "@/components/ui/combobox-searchable";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

interface WardAssignmentProps {
  familyId: string;
  currentWardNumber?: string | null;
  isWardValid?: boolean;
  refetchFamily: () => void;
}

export function WardAssignment({
  familyId,
  currentWardNumber,
  isWardValid = false,
  refetchFamily,
}: WardAssignmentProps) {
  const assignMutation = api.family.assignWardUpdate.useMutation({
    onSuccess: () => {
      toast.success("Successfully assigned ward");
      refetchFamily();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleWardChange = (ward: string) => {
    assignMutation.mutate({
      familyId,
      wardId: ward === "none" ? null : ward,
    });
  };

  // Generate ward numbers 1-7 for example
  const wardOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Ward ${i + 1}`,
  }));

  return (
    <Card className="h-full border-muted-foreground/20 shadow-sm transition-all hover:border-muted-foreground/30 hover:shadow-md">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary/10 p-2">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">
            Ward Assignment
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Assign this family to a specific ward
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComboboxSearchable
          options={[{ value: "none", label: "None" }, ...wardOptions]}
          value={currentWardNumber || "none"}
          onChange={handleWardChange}
          placeholder="Search ward..."
          className="w-full transition-all"
        />
      </CardContent>
    </Card>
  );
}
