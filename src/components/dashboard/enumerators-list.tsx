"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "react-responsive";
import { EnumeratorDropdown } from "./enumerator-dropdown";
import { EnumeratorFilters } from "./enumerator-filters";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Phone,
  Mail,
  MapPin,
  User2,
  ChevronUp,
  ChevronDown,
  Building2,
  Download,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  EnumeratorFilters as Filters,
  SortField,
  SortOrder,
} from "@/types/enumerator";
import { Button } from "../ui/button";

export function EnumeratorsList() {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [filters, setFilters] = useState<Filters>({});
  const [sorting, setSorting] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: "name",
    order: "asc",
  });

  const { data, isLoading } = api.admin.getEnumerators.useQuery({
    filters,
    sorting,
  });

  const handleSort = (field: SortField) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleClick = (id: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on the dropdown
    if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
      return;
    }
    router.push(`/enumerators/${id}`);
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={isActive ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const SortHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead className="cursor-pointer" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {children}
        {sorting.field === field &&
          (sorting.order === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (!data?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <User2 className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            No enumerators found
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Enumerators Table/Grid */}
        <Card className="mt-6">
          <CardHeader className="border-b bg-muted/50 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Enumerators List</CardTitle>
              </div>
              <Badge variant="secondary">{data.length} Records</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isMobile ? (
              <div className="space-y-4 px-2">
                {data.map((enumerator) => (
                  <Card
                    key={enumerator.id}
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                    onClick={(e) => handleClick(enumerator.id, e)}
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {enumerator.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {enumerator.id.slice(0, 8)}
                          </p>
                        </div>
                        {getStatusBadge(enumerator.isActive ?? false)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{enumerator.phoneNumber}</span>
                        </div>
                        {enumerator.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{enumerator.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Ward {enumerator.wardNumber}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <div className="dropdown-trigger">
                          <EnumeratorDropdown enumeratorId={enumerator.id} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortHeader field="name">Name</SortHeader>
                      <TableHead>Contact</TableHead>
                      <SortHeader field="wardNumber">Ward</SortHeader>
                      <SortHeader field="status">Status</SortHeader>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((enumerator) => (
                      <TableRow
                        key={enumerator.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={(e) => handleClick(enumerator.id, e)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{enumerator.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {enumerator.id.slice(0, 8)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{enumerator.phoneNumber}</span>
                            </div>
                            {enumerator.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{enumerator.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Ward {enumerator.wardNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(enumerator.isActive ?? false)}
                        </TableCell>
                        <TableCell>
                          <div className="dropdown-trigger">
                            <EnumeratorDropdown enumeratorId={enumerator.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      {/* Main Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                  <User2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Enumerators Management
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                View and manage all enumerators in the system
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Filters Section - Always visible */}
          <Card>
            <CardHeader className="border-b bg-muted/50 py-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Filter Enumerators</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <EnumeratorFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </CardContent>
          </Card>

          {/* Conditional Content */}
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
