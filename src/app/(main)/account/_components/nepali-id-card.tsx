"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IdCard, Loader2, Pencil, User, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useIdCardStore } from "@/store/id-card-store";

interface NepaliIdCardProps {
  userId: string;
  initialData?: {
    nepaliName?: string | null;
    nepaliAddress?: string | null;
    nepaliPhone?: string | null;
  };
  onUpdate?: () => void;
}

export function NepaliIdCard({
  userId,
  initialData,
  onUpdate,
}: NepaliIdCardProps) {
  const utils = api.useUtils();
  const setDetails = useIdCardStore((state) => state.setDetails);
  const [isEditing, setIsEditing] = useState(false);
  const [nepaliName, setNepaliName] = useState(initialData?.nepaliName || "");
  const [nepaliAddress, setNepaliAddress] = useState(
    initialData?.nepaliAddress || "",
  );
  const [nepaliPhone, setNepaliPhone] = useState(
    initialData?.nepaliPhone || "",
  );

  useEffect(() => {
    // Initialize store with initial data
    if (initialData) {
      setDetails({
        nepaliName: initialData.nepaliName || null,
        nepaliAddress: initialData.nepaliAddress || null,
        nepaliPhone: initialData.nepaliPhone || null,
      });
    }
  }, [initialData, setDetails]);

  // Update store in real-time as user types
  useEffect(() => {
    setDetails({
      nepaliName,
      nepaliAddress,
      nepaliPhone,
    });
  }, [nepaliName, nepaliAddress, nepaliPhone, setDetails]);

  const { mutate: updateDetails, isLoading } =
    api.enumerator.updateIdCardDetails.useMutation({
      onSuccess: () => {
        toast.success("ID card details updated successfully");
        setIsEditing(false);
        // Update store with new values
        setDetails({
          nepaliName,
          nepaliAddress,
          nepaliPhone,
        });
        // Invalidate the enumerator query to refresh data
        utils.enumerator.getById.invalidate(userId);
        onUpdate?.(); // Call onUpdate callback after successful update
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update details");
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetails({
      nepaliName,
      nepaliAddress,
      nepaliPhone,
      enumeratorId: userId,
    });
  };

  const handleCancel = () => {
    setNepaliName(initialData?.nepaliName || "");
    setNepaliAddress(initialData?.nepaliAddress || "");
    setNepaliPhone(initialData?.nepaliPhone || "");
    setIsEditing(false);
  };

  return (
    <Card className="border-primary/10 shadow-md overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <IdCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>ID Card Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">नेपाली विवरण</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2 hover:bg-primary/10"
            >
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                नाम (नेपालीमा)
              </label>
              <Input
                placeholder="नाम"
                value={nepaliName}
                onChange={(e) => setNepaliName(e.target.value)}
                className="border-primary/20 focus:border-primary/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                ठेगाना (नेपालीमा)
              </label>
              <Input
                placeholder="ठेगाना"
                value={nepaliAddress}
                onChange={(e) => setNepaliAddress(e.target.value)}
                className="border-primary/20 focus:border-primary/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                फोन नम्बर (नेपालीमा)
              </label>
              <Input
                placeholder="फोन नम्बर"
                value={nepaliPhone}
                onChange={(e) => setNepaliPhone(e.target.value)}
                className="border-primary/20 focus:border-primary/40"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-primary/20 hover:bg-primary/5"
              >
                रद्द गर्नुहोस्
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                सुरक्षित गर्नुहोस्
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="rounded-full bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">नाम</p>
                <p className="text-lg font-medium">{nepaliName || "सेट छैन"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50/50 border border-green-100">
              <div className="rounded-full bg-green-100 p-2">
                <MapPin className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </p>
                <p className="text-lg font-medium">
                  {nepaliAddress || "सेट छैन"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-orange-50/50 border border-orange-100">
              <div className="rounded-full bg-orange-100 p-2">
                <Phone className="h-5 w-5 text-orange-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  फोन नम्बर
                </p>
                <p className="text-lg font-medium">
                  {nepaliPhone || "सेट छैन"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
