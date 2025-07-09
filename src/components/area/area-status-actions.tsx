import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Area } from "@/server/db/schema";
import { api } from "@/trpc/react";
import {
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AreaStatusActionsProps {
  area: Area;
}

const statusConfig = {
  newly_assigned: {
    label: "Newly Assigned",
    icon: Clock,
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
  ongoing_survey: {
    label: "Ongoing Survey",
    icon: Send,
    color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  },
  revision: {
    label: "In Revision",
    icon: AlertCircle,
    color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  },
  asked_for_completion: {
    label: "Completion Requested",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  },
  asked_for_revision_completion: {
    label: "Revision Completion Requested",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  },
  asked_for_withdrawl: {
    label: "Withdrawal Requested",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
};

export function AreaStatusActions({ area }: AreaStatusActionsProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "completion" | "revision" | "withdrawal"
  >("completion");

  const utils = api.useContext();

  const { mutate: requestCompletion, isLoading: isRequestingCompletion } =
    api.enumerator.requestCompletion.useMutation({
      onSuccess: () => {
        utils.enumerator.getAssignedArea.invalidate();
      },
    });

  const {
    mutate: requestRevisionCompletion,
    isLoading: isRequestingRevisionCompletion,
  } = api.enumerator.requestRevisionCompletion.useMutation({
    onSuccess: () => {
      utils.enumerator.getAssignedArea.invalidate();
    },
  });

  const { mutate: requestWithdrawal, isLoading: isRequestingWithdrawal } =
    api.enumerator.requestWithdrawal.useMutation({
      onSuccess: () => {
        utils.enumerator.getAssignedArea.invalidate();
      },
    });

  const handleAction = (type: "completion" | "revision" | "withdrawal") => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    switch (actionType) {
      case "completion":
        requestCompletion();
        break;
      case "revision":
        requestRevisionCompletion();
        break;
      case "withdrawal":
        requestWithdrawal();
        break;
    }
    setConfirmDialogOpen(false);
  };

  const getStatusBadge = () => {
    const status = area.areaStatus ?? "unknown";
    const config = statusConfig[status as keyof typeof statusConfig];

    if (!config) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Badge
          variant="outline"
          className={cn(
            "px-3 py-1 text-sm font-medium flex items-center gap-1.5",
            config.color,
          )}
        >
          <config.icon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      </motion.div>
    );
  };

  const getActionButtons = () => {
    const baseButtonClasses =
      "relative transition-all duration-200 h-9 text-sm gap-2 px-3";

    switch (area.areaStatus) {
      case "revision":
      case "newly_assigned":
      case "ongoing_survey":
        return (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className={cn(baseButtonClasses)}
              onClick={() => handleAction("completion")}
              disabled={isRequestingCompletion}
            >
              {isRequestingCompletion ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ClipboardCheck className="h-4 w-4" />
              )}
              <span>Request Completion</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                baseButtonClasses,
                "text-destructive hover:text-destructive-foreground hover:bg-destructive",
              )}
              onClick={() => handleAction("withdrawal")}
              disabled={isRequestingWithdrawal}
            >
              {isRequestingWithdrawal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <span>Request Withdrawal</span>
            </Button>
          </div>
        );
      // ...other status cases...
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="border-b bg-muted/50 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Status Actions</h3>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="p-6">{getActionButtons()}</CardContent>
        </Card>

        <AlertDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
        >
          <AlertDialogContent className="sm:max-w-[425px] z-[1000]">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {actionType === "completion" && (
                  <ClipboardCheck className="h-5 w-5 text-green-500" />
                )}
                {actionType === "revision" && (
                  <RotateCcw className="h-5 w-5 text-blue-500" />
                )}
                {actionType === "withdrawal" && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Confirm{" "}
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-2">
                {actionType === "completion" &&
                  "Are you sure you want to request completion of this area? This action indicates that you have completed all the required surveys in this area."}
                {actionType === "revision" &&
                  "Are you sure you want to submit this area for revision completion? This indicates you have addressed all revision requests."}
                {actionType === "withdrawal" &&
                  "Are you sure you want to request withdrawal from this area? This will notify administrators that you can no longer continue surveying this area."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                className={cn(
                  "gap-2",
                  actionType === "withdrawal" && "bg-red-500 hover:bg-red-600",
                )}
              >
                {actionType === "completion" && (
                  <ClipboardCheck className="h-4 w-4" />
                )}
                {actionType === "revision" && <RotateCcw className="h-4 w-4" />}
                {actionType === "withdrawal" && (
                  <AlertTriangle className="h-4 w-4" />
                )}
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AnimatePresence>
  );
}
