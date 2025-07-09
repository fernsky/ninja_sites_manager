import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCheck, Users } from "lucide-react";
import { toast } from "sonner";

export function EnumeratorAssignment({
  businessId,
  currentEnumeratorId,
  refetchBusiness,
}: {
  businessId: string;
  currentEnumeratorId?: string;
  refetchBusiness: () => void;
}) {
  const { data: enumerators, isLoading } = api.admin.getEnumerators.useQuery({
    // pageIndex: 0,
    // pageSize: 10,
    filters: {},
    sorting: {
      field: "wardNumber",
      order: "asc",
    },
  });
  const assignMutation = api.business.assignToEnumerator.useMutation({
    onSuccess: () => {
      toast.success("Successfully assigned enumerator");
      refetchBusiness();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAssign = (enumeratorId: string) => {
    assignMutation.mutate({
      businessId,
      enumeratorId,
    });
  };

  return (
    <Card className="h-full border-muted-foreground/20 shadow-sm transition-all hover:border-muted-foreground/30 hover:shadow-md">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">
            Enumerator Assignment
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Select an enumerator for this business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={currentEnumeratorId}
          onValueChange={handleAssign}
          disabled={isLoading || assignMutation.isLoading}
        >
          <SelectTrigger className="w-full transition-all hover:border-primary focus-visible:ring-1 focus-visible:ring-primary">
            <SelectValue placeholder="Select an enumerator" />
          </SelectTrigger>
          <SelectContent>
            {enumerators?.map((enumerator) => (
              <SelectItem
                key={enumerator.id}
                value={enumerator.id}
                className="focus:bg-primary/5"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  {enumerator.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
