import { useState } from "react";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Client } from "@/types/client";

interface ClientsTableProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
}

export const ClientsTable = ({ clients, onClientSelect }: ClientsTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const sortedClients = [...clients].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "valueNumeric") {
      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const handleSort = (key: keyof Client) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      Lead: "bg-slate-500",
      Qualified: "bg-blue-500",
      "Proposal Sent": "bg-purple-500",
      "In Negotiation": "bg-yellow-500",
      Won: "bg-green-500",
    };
    return colors[stage] || "bg-slate-500";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Proposal Rejected": "text-red-600",
      "In Negotiation": "text-yellow-600",
      "On Hold": "text-orange-600",
    };
    return colors[status] || "text-muted-foreground";
  };

  const getPriorityVariant = (priority: string) => {
    const variants: Record<string, "default" | "destructive" | "outline"> = {
      high: "destructive",
      medium: "default",
      low: "outline",
    };
    return variants[priority.toLowerCase()] || "outline";
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("name")}
                className="hover:bg-transparent"
              >
                Client <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("stage")}
                className="hover:bg-transparent"
              >
                Stage <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("proposalStatus")}
                className="hover:bg-transparent"
              >
                Status <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("valueNumeric")}
                className="hover:bg-transparent"
              >
                Value <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("daysInPipeline")}
                className="hover:bg-transparent"
              >
                Days in Pipeline <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">Last Follow-up</TableHead>
            <TableHead className="font-semibold">Next Follow-up</TableHead>
            <TableHead className="font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("priority")}
                className="hover:bg-transparent"
              >
                Priority <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClients.map((client) => (
            <TableRow key={client.id} className="hover:bg-muted/50">
              <TableCell>
                <div>
                  <div className="font-semibold">{client.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {client.contactPerson}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={cn("h-2.5 w-2.5 rounded-full", getStageColor(client.stage))}
                  />
                  <span className="text-sm">{client.stage}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={cn("text-sm font-medium", getStatusColor(client.proposalStatus))}>
                  {client.proposalStatus || "—"}
                </span>
              </TableCell>
              <TableCell className="font-semibold">{client.projectValue}</TableCell>
              <TableCell>
                <span className="text-sm">{client.daysInPipeline}</span>
                <span className="text-xs text-muted-foreground ml-1">days</span>
              </TableCell>
              <TableCell className="text-sm">{client.lastFollowup}</TableCell>
              <TableCell className="text-sm">{client.nextFollowup}</TableCell>
              <TableCell>
                <Badge variant={getPriorityVariant(client.priority)} className="uppercase">
                  {client.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onClientSelect(client)}
                  className="text-primary hover:text-primary/80"
                >
                  Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
