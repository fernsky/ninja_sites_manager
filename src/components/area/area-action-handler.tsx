"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { api } from "@/trpc/react";
import {
  ClipboardCheck,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AreaActionTableView } from "./area-action-table-view";
import { AreaActionCardView } from "./area-action-card-view";

export default function AreaActionHandler() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    areaId: string;
    type: string;
    action: "approve" | "reject";
  } | null>(null);
  const [message, setMessage] = useState("");

  const {
    data,
    isLoading,
    refetch: refetchPendingActions,
  } = api.areaManagement.getPendingActions.useQuery({
    status: selectedStatus as any,
    wardNumber: selectedWard ? parseInt(selectedWard) : undefined,
    page,
    limit: 10,
  });

  const { mutate: approveCompletion, isLoading: isApprovingCompletion } =
    api.areaManagement.approveCompletion.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        setMessage("");
        refetchPendingActions();
      },
    });

  const { mutate: handleAction, isLoading: isHandlingAction } =
    api.areaManagement.handleAction.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        setMessage("");
        refetchPendingActions();
      },
    });

  const { mutate: handleWithdrawal, isLoading: isHandlingWithdrawal } =
    api.areaManagement.handleWithdrawal.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        setMessage("");
        refetchPendingActions();
      },
    });

  const handleActionClick = (
    areaId: string,
    type: string,
    action: "approve" | "reject",
  ) => {
    setSelectedAction({ areaId, type, action });
    setDialogOpen(true);
  };

  const Pagination = () => {
    if (!data) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border rounded-md p-4 mt-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Showing{" "}
          <span className="font-medium">
            {page * 10 + 1} - {Math.min((page + 1) * 10, data.pagination.total)}
          </span>{" "}
          of <span className="font-medium">{data.pagination.total}</span>{" "}
          requests
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * 10 >= data.pagination.total}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Filters</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="asked_for_completion">
                  Completion Requests
                </SelectItem>
                <SelectItem value="asked_for_revision_completion">
                  Revision Completion
                </SelectItem>
                <SelectItem value="asked_for_withdrawl">
                  Withdrawal Requests
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {Array.from({ length: 7 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Ward {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Pending Actions</CardTitle>
            </div>
            {data && (
              <Badge variant="secondary">
                {data.pagination.total} Pending Request
                {data.pagination.total !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !data?.actions.length ? (
            <div className="flex flex-col items-center justify-center py-8">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                No pending requests
              </p>
              <p className="text-sm text-muted-foreground">
                All area requests have been handled
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <AreaActionTableView
                  //@ts-ignore
                  data={data.actions.map((action) => ({
                    ...action,
                    code: String(action.code),
                  }))}
                  onAction={handleActionClick}
                />
              </div>
              <div className="block md:hidden">
                <AreaActionCardView
                  //@ts-ignore
                  data={data.actions.map((action) => ({
                    ...action,
                    code: String(action.code),
                  }))}
                  onAction={handleActionClick}
                />
              </div>
              <Pagination />
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAction?.action === "approve" ? "Approve" : "Reject"}{" "}
              Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction?.action === "approve"
                ? "Are you sure you want to approve this request?"
                : "Are you sure you want to reject this request? Please provide a reason."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Textarea
            placeholder="Add a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-4"
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!selectedAction) return;

                if (
                  selectedAction.type === "asked_for_completion" &&
                  selectedAction.action === "approve"
                ) {
                  approveCompletion({
                    areaId: selectedAction.areaId,
                    message,
                  });
                } else if (selectedAction.type === "asked_for_withdrawl") {
                  handleWithdrawal({
                    areaId: selectedAction.areaId,
                    approved: selectedAction.action === "approve",
                    message,
                  });
                } else {
                  handleAction({
                    areaId: selectedAction.areaId,
                    action: selectedAction.action,
                    message,
                    newStatus:
                      selectedAction.action === "approve"
                        ? "completed"
                        : "revision",
                  });
                }
              }}
              className={
                selectedAction?.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isHandlingAction ||
              isApprovingCompletion ||
              isHandlingWithdrawal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : selectedAction?.action === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
