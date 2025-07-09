"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload, X, FileImage } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/trpc/react";

interface FormPhotoUploaderProps {
  onUploadSuccess?: () => void;
}

export function FormPhotoUploader({ onUploadSuccess }: FormPhotoUploaderProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [areaCode, setAreaCode] = useState("");
  const [formType, setFormType] = useState<"building" | "family" | "">("");
  const [pageNumber, setPageNumber] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { mutate: uploadPhoto } = api.enumerator.uploadFormPhoto.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      setSelectedPhoto(null);
      setAreaCode("");
      setFormType("");
      setPageNumber(undefined);
      setDescription("");
      setError(null);
      onUploadSuccess?.();
    },
    onError: (error) => {
      setIsLoading(false);
      setError(error.message);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedPhoto(result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setIsUsingCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Unable to access camera. Please try uploading a file instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsUsingCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setSelectedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedPhoto) {
      setError("Please select or capture a photo first");
      return;
    }

    if (!areaCode.trim()) {
      setError("Please enter the area code");
      return;
    }

    if (!formType) {
      setError("Please select the form type");
      return;
    }

    try {
      setIsLoading(true);
      uploadPhoto({
        photo: selectedPhoto,
        areaCode: areaCode.trim(),
        formType,
        pageNumber,
        description: description || undefined,
      });
    } catch (err) {
      setIsLoading(false);
      setError("Failed to upload photo. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedPhoto(null);
    setAreaCode("");
    setFormType("");
    setPageNumber(undefined);
    setDescription("");
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Form Photo</h3>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Area Code Input */}
        <div>
          <Label htmlFor="areaCode">Area Code *</Label>
          <Input
            id="areaCode"
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value)}
            placeholder="Enter area code (e.g., A001)"
            disabled={isLoading}
          />
        </div>

        {/* Form Type Selection */}
        <div>
          <Label htmlFor="formType">Form Type *</Label>
          <Select
            value={formType}
            onValueChange={(value: "building" | "family") => setFormType(value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select form type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="building">Building Form</SelectItem>
              <SelectItem value="family">Family Survey Form</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page Number Input */}
        <div>
          <Label htmlFor="pageNumber">Page Number (Optional)</Label>
          <Input
            id="pageNumber"
            type="number"
            min="1"
            value={pageNumber || ""}
            onChange={(e) =>
              setPageNumber(
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            placeholder="Enter page number"
            disabled={isLoading}
          />
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description for this form photo"
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Photo Capture/Upload Section */}
        {!selectedPhoto && !isUsingCamera && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={startCamera}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Camera View */}
        {isUsingCamera && (
          <div className="space-y-3">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                className="flex-1"
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Photo Preview */}
        {selectedPhoto && (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={selectedPhoto}
                alt="Form photo preview"
                className="w-full h-64 object-cover rounded-lg border"
              />
              <Button
                onClick={resetForm}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Form Photo
                </>
              )}
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
