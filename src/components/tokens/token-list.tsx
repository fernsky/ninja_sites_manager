import { useMediaQuery } from "react-responsive";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Copy, Filter, Key } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import BuildingForm from "@/components/forms/BuildingForm";
import FamilyForm from "@/components/forms/FamilyForm";
import InstitutionalForm from "../forms/InstitutionalForm";
import BusinessForm from "../forms/BusinessForm";

interface TokenListProps {
  areaId: string;
}

// Add this new component for mobile card view
const TokenCard = ({
  token,
  onCopy,
}: {
  token: any;
  onCopy: (token: string) => void;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 space-y-2 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <div className="font-mono text-sm font-medium">{token.token}</div>
        <Badge
          variant={token.status === "allocated" ? "default" : "secondary"}
          className="mt-1"
        >
          {token.status}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCopy(token.token)}
        className="hover:bg-primary/10"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const TokenTable = ({
  data,
  onCopy,
}: {
  data: { tokens: any[]; pagination: any };
  onCopy: (token: string) => void;
}) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (!isDesktop) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {data.tokens.map((token) => (
          <TokenCard key={token.token} token={token} onCopy={onCopy} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Token</TableHead>
            <TableHead className="w-[30%]">Status</TableHead>
            <TableHead className="text-right w-[30%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.tokens.map((token) => (
            <TableRow key={token.token}>
              <TableCell className="font-mono break-all">
                {token.token}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    token.status === "allocated" ? "default" : "secondary"
                  }
                >
                  {token.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(token.token)}
                >
                  <Copy className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (newPage: number) => void;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border rounded-md p-4">
      <p className="text-sm text-muted-foreground text-center sm:text-left">
        Showing{" "}
        <span className="font-medium">
          {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)}
        </span>{" "}
        of <span className="font-medium">{total}</span> tokens
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={(page + 1) * pageSize >= total}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const TokenList = ({ areaId }: TokenListProps) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [status, setStatus] = useState<"allocated" | "unallocated" | undefined>(
    undefined,
  );
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const { data, isLoading } = api.area.getAreaTokens.useQuery({
    areaId,
    status,
    limit: pageSize,
    offset: page * pageSize,
  });

  const copyToClipboard = async (token: string) => {
    await navigator.clipboard.writeText(token);
  };

  return (
    <Card className="bg-gray-50/50">
      <CardContent className="p-3 sm:p-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !data || !data.tokens.length ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Key className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              No tokens found
            </p>
            <p className="text-sm text-muted-foreground">
              {status
                ? `No ${status} tokens available`
                : "No tokens available for this area"}
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-0 bg-gray-50/80 backdrop-blur-sm p-3 -mx-3 sm:mx-0 sm:p-0 sm:static sm:bg-transparent">
              <div className="inline-flex gap-2 flex-wrap">
                <BuildingForm areaId={areaId} />
                <FamilyForm
                  //@ts-ignore
                  buildingTokens={data.tokens
                    .filter((t) => t.status === "allocated")
                    .map((t) => t.token)}
                  areaId={areaId}
                />
                <InstitutionalForm areaId={areaId} />
                <BusinessForm areaId={areaId} />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div
                className={`
                ${!isDesktop ? "grid grid-cols-1 gap-2" : "rounded-lg bg-white"}
              `}
              >
                <TokenTable data={data} onCopy={copyToClipboard} />
              </div>

              <div className="sticky bottom-0 bg-gray-50/80 backdrop-blur-sm p-3 -mx-3 sm:mx-0 sm:p-0 sm:static sm:bg-transparent">
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={data.pagination.total}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
