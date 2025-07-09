"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { ExclamationTriangleIcon } from "@/components/icons";
import { logout } from "@/lib/auth/actions";
import { toast } from "sonner";
import { User } from "lucide-react";

export const UserDropdown = ({
  email,
  className,
}: {
  email: string;
  className?: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${className} rounded-full bg-white p-2 shadow-sm hover:bg-gray-100`}
      >
        <User className="h-4 w-4 text-gray-700" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            asChild
          >
            <Link href="/">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            asChild
          >
            <Link href="///settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="p-0">
          <SignoutConfirmation />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SignoutConfirmation = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast("Signed out successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, {
          icon: (
            <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
          ),
        });
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="px-2 py-1.5 text-sm text-muted-foreground outline-none"
        asChild
      >
        <button>Sign out</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px] p-6">
        <AlertDialogHeader className="gap-4">
          <AlertDialogTitle className="text-left text-xl">
            Sign out from Dashboard?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm text-muted-foreground">
            You will be signed out of your account and redirected to the login
            page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="sm:min-w-[100px]"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            onClick={handleSignout}
            variant="destructive"
            className="sm:min-w-[100px]"
          >
            Sign out
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
