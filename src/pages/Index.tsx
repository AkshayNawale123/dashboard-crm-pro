import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { ClientsTable } from "@/components/ClientsTable";
import { ClientDetailsDialog } from "@/components/ClientDetailsDialog";
import { mockClients } from "@/data/mockClients";
import { Client } from "@/types/client";

const Index = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  // Calculate metrics
  const totalClients = mockClients.length;
  const wonClients = mockClients.filter((c) => c.stage === "Won").length;
  const negotiationClients = mockClients.filter(
    (c) => c.proposalStatus === "In Negotiation"
  ).length;
  const rejectedClients = mockClients.filter(
    (c) => c.proposalStatus === "Proposal Rejected"
  ).length;
  const totalPipeline = mockClients.reduce(
    (sum, client) => sum + client.valueNumeric,
    0
  );
  const formattedPipeline = `$${(totalPipeline / 1000000).toFixed(2)}M`;

  return (
    <div className="min-h-screen bg-background">
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
          <MetricCard
            label="Total Pipeline"
            value={formattedPipeline}
            valueColor="text-primary"
          />
        </div>

        {/* Clients Table */}
        <ClientsTable clients={mockClients} onClientSelect={handleClientSelect} />

        {/* Client Details Dialog */}
        <ClientDetailsDialog
          client={selectedClient}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </div>
  );
};

export default Index;
