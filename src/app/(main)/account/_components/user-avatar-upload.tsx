"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserAvatarUploadProps {
  userId: string;
  currentAvatar?: string | null;
  onUploadSuccess?: () => void;
}

export function UserAvatarUpload({
  userId,
  currentAvatar,
  onUploadSuccess,
}: UserAvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cropperFile, setCropperFile] = useState<string | null>(null);
  const [cropper, setCropper] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  // Simplified avatar URL query
  const { data: avatarUrl } = api.enumerator.getAvatarUrl.useQuery(userId, {
    enabled: !!currentAvatar,
    refetchInterval: false,
  });

  const { mutate: uploadPhoto } = api.enumerator.uploadIdCardPhoto.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      setIsOpen(false);
      setCropperFile(null);
      toast.success("Photo uploaded successfully");
      onUploadSuccess?.();
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Failed to upload photo");
    },
  });

  const handleCrop = async () => {
    if (!cropper || isLoading) return;

    try {
      setIsLoading(true);
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      const croppedImage = croppedCanvas.toDataURL("image/jpeg", 0.8);
      uploadPhoto({ photo: croppedImage, enumeratorId: userId });
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to process image");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <>
      <div className="relative group">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
          {currentAvatar && avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                     transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => !isLoading && setIsOpen(true)}
          >
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => !isLoading && setIsOpen(open)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Profile Photo</DialogTitle>
          </DialogHeader>

          {!cropperFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag & drop a photo here, or click to select one
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: 5MB. Supported formats: JPEG, PNG
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative h-[400px]">
                <Cropper
                  src={cropperFile}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={1}
                  guides={true}
                  onInitialized={(instance) => setCropper(instance)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCropperFile(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleCrop} disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </div>
                  ) : (
                    "Save Photo"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
