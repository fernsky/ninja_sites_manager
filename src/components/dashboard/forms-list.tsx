"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { Edit3 } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

export function FormsList() {
  const [forms] = api.useQueries((t) => [t.superadmin.getSurveyForms()]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();

  const handleRowClick = (formId: string, event: React.MouseEvent) => {
    // Prevent navigation if clicking edit link
    const isEditClick = (event.target as HTMLElement).closest("a");
    if (!isEditClick) {
      router.push(`/forms/show/${formId}`);
    }
  };

  if (!forms.data?.length) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        No forms found
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {forms.data.map((form) => (
          <Card
            key={form.id}
            className="shadow-lg cursor-pointer"
            onClick={(e) => handleRowClick(form.id, e)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {form.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">ID: {form.id}</p>
              <Link
                href={`/forms/update/${form.id}`}
                className="text-blue-500 hover:underline flex items-center"
              >
                <Edit3 className="inline-block mr-2 w-4 h-4" />
                Edit
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-lg p-4 bg-white">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {forms.data.map((form) => (
            <TableRow
              key={form.id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={(e) => handleRowClick(form.id, e)}
            >
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {form.id}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {form.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                <Link
                  href={`/forms/update/${form.id}`}
                  className="flex items-center hover:underline"
                >
                  <Edit3 className="inline-block mr-2 w-4 h-4" />
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
