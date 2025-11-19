import { useState, useMemo } from "react";
import { ClientsTable } from "@/components/ClientsTable";
import { ClientDetailsDialog } from "@/components/ClientDetailsDialog";
import { FilterBar } from "@/components/FilterBar";
import { MetricCard } from "@/components/MetricCard";
import { useClients } from "@/contexts/ClientContext";
import { Client } from "@/types/client";
import { exportToCSV } from "@/utils/exportCsv";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        client.name.toLowerCase().includes(searchLower) ||
        client.contactPerson.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower);

      // Stage filter
      const matchesStage = stageFilter === "all" || client.stage === stageFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" || client.proposalStatus === statusFilter;

      // Priority filter
      const matchesPriority =
        priorityFilter === "all" || client.priority === priorityFilter;

      return matchesSearch && matchesStage && matchesStatus && matchesPriority;
    });
  }, [clients, searchQuery, stageFilter, statusFilter, priorityFilter]);

  // Calculate active filters count
  const activeFiltersCount =
    (stageFilter !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (priorityFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setStageFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSearchQuery("");
  };

  const handleExport = () => {
    exportToCSV(filteredClients);
    toast({
      title: "Export Successful",
      description: `Exported ${filteredClients.length} client(s) to CSV.`,
    });
  };

  // Calculate metrics using filtered clients
  const totalClients = filteredClients.length;
  const wonClients = filteredClients.filter((c) => c.stage === "Won").length;
  const negotiationClients = filteredClients.filter(
    (c) => c.proposalStatus === "In Negotiation"
  ).length;
  const rejectedClients = filteredClients.filter(
    (c) => c.proposalStatus === "Proposal Rejected"
  ).length;
  const totalPipeline = filteredClients.reduce(
    (sum, client) => sum + client.valueNumeric,
    0
  );
  const formattedPipeline = `$${(totalPipeline / 1000000).toFixed(2)}M`;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Executive CRM Dashboard
        </h1>
        <p className="text-muted-foreground">
          High-level view of all client relationships and project stages
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <MetricCard label="Total Clients" value={totalClients} />
        <MetricCard
          label="Won"
          value={wonClients}
          valueColor="text-green-600"
        />
        <MetricCard
          label="In Negotiation"
          value={negotiationClients}
          valueColor="text-yellow-600"
        />
        <MetricCard
          label="Rejected"
          value={rejectedClients}
          valueColor="text-red-600"
        />
        <MetricCard label="Pipeline Value" value={formattedPipeline} />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
        onExport={handleExport}
      />

      {/* Clients Table */}
      <ClientsTable
        clients={filteredClients}
        onClientSelect={(client) => {
          setSelectedClient(client);
          setIsDetailsOpen(true);
        }}
      />

      {/* Client Details Dialog */}
      <ClientDetailsDialog
        client={selectedClient}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default Index;
