"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarIcon, Hash, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const FetchSubmissions = ({ formId }: { formId: string }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [count, setCount] = useState<string>("100");

  const fetchMutation = api.superadmin.fetchSurveySubmissions.useMutation({
    onSuccess: () => {
      toast.success("Submissions fetched successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMutation.mutate({
      id: formId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      count: count ? parseInt(count) : undefined,
    });
  };

  return (
    <Card className="backdrop-blur-sm bg-white/50 border-border/50">
      <CardHeader className="pb-8 border-b">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Fetch Form Submissions
            </CardTitle>
            <CardDescription className="mt-1.5">
              Specify a date range and limit to fetch submissions from ODK
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  Start Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  End Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Number of Submissions
              </label>
              <div className="relative max-w-[200px]">
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  className="h-9"
                  placeholder="Enter limit..."
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum number of submissions to fetch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              disabled={fetchMutation.isLoading}
              className={cn(
                "min-w-[140px] relative",
                fetchMutation.isLoading && "cursor-not-allowed opacity-80",
              )}
            >
              {fetchMutation.isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Fetching...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Fetch Submissions
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setCount("100");
              }}
            >
              Reset
            </Button>
          </div>

          {fetchMutation.isError && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                {fetchMutation.error.message}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
