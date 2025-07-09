"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import {
  Check,
  XCircle,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle,
  Shield,
  AlertCircle,
  History,
  Info,
} from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BuildingStatus =
  | "pending"
  | "approved"
  | "requested_for_edit"
  | "rejected";

interface BuildingActionsProps {
  buildingId: string;
  currentStatus: BuildingStatus;
  onStatusChange?: () => void;
}

const StatusBadge = ({ status }: { status: BuildingStatus }) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      text: "Pending",
      className: "bg-yellow-100 text-yellow-800",
    },
    approved: {
      icon: CheckCircle,
      text: "Approved",
      className: "bg-green-100 text-green-800",
    },
    requested_for_edit: {
      icon: Edit,
      text: "Edit Requested",
      className: "bg-blue-100 text-blue-800",
    },
    rejected: {
      icon: XCircle,
      text: "Rejected",
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        config.className,
      )}
    >
      <Icon className="mr-1 h-4 w-4" />
      {config.text}
    </div>
  );
};

export function BuildingActions({
  buildingId,
  currentStatus,
  onStatusChange,
}: BuildingActionsProps) {
  const [message, setMessage] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const approve = api.building.approve.useMutation({
    onSuccess: () => {
      toast.success("Building approved successfully");
      onStatusChange?.();
    },
  });

  const requestEdit = api.building.requestEdit.useMutation({
    onSuccess: () => {
      toast.success("Edit requested successfully");
      setIsEditDialogOpen(false);
      setMessage("");
      onStatusChange?.();
    },
  });

  const reject = api.building.reject.useMutation({
    onSuccess: () => {
      toast.success("Building rejected successfully");
      setIsRejectDialogOpen(false);
      setMessage("");
      onStatusChange?.();
    },
  });

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({ buildingId });
    } catch (error) {
      toast.error("Failed to approve building");
    }
  };

  const handleRequestEdit = async () => {
    if (!message) {
      toast.error("Please provide a reason for the edit request");
      return;
    }
    try {
      await requestEdit.mutateAsync({ buildingId, message });
    } catch (error) {
      toast.error("Failed to request edit");
    }
  };

  const handleReject = async () => {
    if (!message) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await reject.mutateAsync({ buildingId, message });
    } catch (error) {
      toast.error("Failed to reject building");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b bg-muted/50 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Verification Status</h3>
          </div>
          <StatusBadge status={currentStatus} />
        </div>
        <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <p>Change building status to manage survey verification workflow</p>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Status Info Box */}
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Current Status
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-background p-2">
                <span className="text-muted-foreground">Last Updated</span>
                <p className="mt-1 font-medium">Today, 2:30 PM</p>
              </div>
              <div className="rounded-md bg-background p-2">
                <span className="text-muted-foreground">Modified By</span>
                <p className="mt-1 font-medium">Admin User</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {currentStatus !== "approved" && (
              <Button
                size="sm"
                variant="default"
                onClick={handleApprove}
                disabled={approve.isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <div className="flex items-center gap-1.5">
                  <div className="rounded-full bg-white/20 p-1">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Approve</span>
                </div>
              </Button>
            )}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentStatus === "requested_for_edit"}
                  className="flex-1 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 shadow-sm hover:shadow transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:hover:bg-blue-50"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="rounded-full bg-blue-500/10 p-1">
                      <Edit className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-blue-700">Edit</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    Request Building Edit
                  </DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Provide details about what needs to be edited..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="resize-none mt-2"
                />
                <DialogFooter className="mt-4 flex gap-2 flex-wrap sm:flex-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    onClick={handleRequestEdit}
                    loading={requestEdit.isLoading}
                    className="flex-1"
                  >
                    Submit Request
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {currentStatus !== "rejected" && (
              <Dialog
                open={isRejectDialogOpen}
                onOpenChange={setIsRejectDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-full bg-white/20 p-1">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <span>Reject</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Reject Building
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="Provide reason for rejection..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="resize-none mt-2"
                  />
                  <DialogFooter className="mt-4 flex gap-2 flex-wrap sm:flex-nowrap">
                    <Button
                      variant="ghost"
                      onClick={() => setIsRejectDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="destructive"
                      onClick={handleReject}
                      loading={reject.isLoading}
                      className="flex-1"
                    >
                      Reject Building
                    </LoadingButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
