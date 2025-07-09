"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import {
  CheckCircle,
  User,
  Calendar,
  Clock,
  Award,
  FileText,
  AlertTriangle,
  Globe,
  Building2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SolutionDetailProps {
  solutionId: string;
}

export function SolutionDetail({ solutionId }: SolutionDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: solution,
    isLoading: isLoadingSolution,
    error: solutionError,
  } = api.manager.getSolutionById.useQuery({ id: solutionId });

  const {
    data: issue,
    isLoading: isLoadingIssue,
    error: issueError,
  } = api.manager.getIssueById.useQuery(
    { id: solution?.issueId || "" },
    { enabled: !!solution?.issueId },
  );

  const {
    data: site,
    isLoading: isLoadingSite,
    error: siteError,
  } = api.manager.getSiteById.useQuery(
    { id: issue?.siteId || "" },
    { enabled: !!issue?.siteId },
  );

  const handleViewSite = () => {
    if (site?.id) {
      router.push(`/site/show/${site.id}`);
    }
  };

  const handleViewIssue = () => {
    if (issue?.id) {
      router.push(`/issues`);
    }
  };

  if (isLoadingSolution) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        Loading solution details...
      </div>
    );
  }

  if (solutionError) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading solution: {solutionError.message}
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">Solution not found</p>
        <p className="text-sm">
          The solution you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/solutions")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Solutions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/solutions")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Solutions
          </Button>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Solution #{solution.id.slice(-6)}
              </h1>
              <p className="text-muted-foreground">Issue Resolution Details</p>
            </div>
          </div>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Award className="h-4 w-4 mr-1" />
          Resolved
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solution Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Solution Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Solution ID
                </label>
                <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                  {solution.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Issue ID
                </label>
                <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                  {solution.issueId}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Solved By
              </label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{solution.whoSolved}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Solution Description
              </label>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {solution.howSolved}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Solved Date
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(solution.solvedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created Date
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(solution.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Issue Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Related Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingIssue ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">
                  Loading issue details...
                </p>
              </div>
            ) : issueError ? (
              <div className="text-center py-4 text-red-500">
                Error loading issue: {issueError.message}
              </div>
            ) : issue ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Issue ID
                    </label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                      {issue.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Priority
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          issue.priority === "CRITICAL"
                            ? "destructive"
                            : issue.priority === "HIGH"
                              ? "default"
                              : issue.priority === "MEDIUM"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Issue Types
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {issue.issueTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleViewIssue}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Issue Details
                </Button>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Issue details not available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Site Information */}
      {site && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Affected Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Agency Name
                </label>
                <p className="font-medium mt-1">{site.nameOfAgency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Location
                </label>
                <p className="text-sm mt-1">
                  {site.province}, {site.district}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Website
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    {site.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleViewSite} variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                View Site Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
