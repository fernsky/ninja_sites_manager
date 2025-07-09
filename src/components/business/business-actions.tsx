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
  CheckCircle,
  AlertCircle,
  Shield,
  Info,
} from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  // Helper function to determine if actions are allowed
  const isActionable = currentStatus === "pending";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <StatusBadge status={currentStatus} />

        {/* Only show actions if the building is in pending state */}
        {isActionable && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleApprove}
              disabled={approve.isLoading}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Request Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Building Edit</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Provide details about what needs to be edited..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    onClick={handleRequestEdit}
                    loading={requestEdit.isLoading}
                  >
                    Submit Request
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isRejectDialogOpen}
              onOpenChange={setIsRejectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Building</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Provide reason for rejection..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsRejectDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="destructive"
                    onClick={handleReject}
                    loading={reject.isLoading}
                  >
                    Reject Building
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Show status message for edit requested state */}
        {currentStatus === "requested_for_edit" && (
          <p className="text-sm text-muted-foreground">
            Waiting for enumerator to edit the building data
          </p>
        )}
      </div>
    </div>
  );
}

type BusinessStatus =
  | "pending"
  | "approved"
  | "requested_for_edit"
  | "rejected";

interface BusinessActionsProps {
  businessId: string;
  currentStatus: BusinessStatus;
  onStatusChange?: () => void;
}

export function BusinessActions({
  businessId,
  currentStatus,
  onStatusChange,
}: BusinessActionsProps) {
  const [message, setMessage] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const approve = api.business.approve.useMutation({
    onSuccess: () => {
      toast.success("Business approved successfully");
      onStatusChange?.();
    },
  });

  const requestEdit = api.business.requestEdit.useMutation({
    onSuccess: () => {
      toast.success("Edit requested successfully");
      setIsEditDialogOpen(false);
      setMessage("");
      onStatusChange?.();
    },
  });

  const reject = api.business.reject.useMutation({
    onSuccess: () => {
      toast.success("Business rejected successfully");
      setIsRejectDialogOpen(false);
      setMessage("");
      onStatusChange?.();
    },
  });

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({ businessId });
    } catch (error) {
      toast.error("Failed to approve business");
    }
  };

  const handleRequestEdit = async () => {
    if (!message) {
      toast.error("Please provide a reason for the edit request");
      return;
    }
    try {
      await requestEdit.mutateAsync({ businessId, message });
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
      await reject.mutateAsync({ businessId, message });
    } catch (error) {
      toast.error("Failed to reject business");
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
          <p>Change business status to manage survey verification workflow</p>
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
                <Button size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Request Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Business Edit</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Provide details about what needs to be edited..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    onClick={handleRequestEdit}
                    loading={requestEdit.isLoading}
                  >
                    Submit Request
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isRejectDialogOpen}
              onOpenChange={setIsRejectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Business</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Provide reason for rejection..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsRejectDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="destructive"
                    onClick={handleReject}
                    loading={reject.isLoading}
                  >
                    Reject Business
                  </LoadingButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
