import { Client } from "@/types/client";

export const exportToCSV = (clients: Client[], filename: string = "clients-export.csv") => {
  // Define CSV headers
  const headers = [
    "Client Name",
    "Contact Person",
    "Email",
    "Phone",
    "Stage",
    "Proposal Status",
    "Project Value",
    "Priority",
    "Days in Pipeline",
    "First Contact Date",
    "Last Follow-up",
    "Next Follow-up",
    "Notes",
  ];

  // Convert clients to CSV rows
  const rows = clients.map((client) => [
    client.name,
    client.contactPerson,
    client.email,
    client.phone,
    client.stage,
    client.proposalStatus || "—",
    client.projectValue,
    client.priority,
    client.daysInPipeline.toString(),
    client.firstContactDate,
    client.lastFollowup,
    client.nextFollowup,
    client.notes.replace(/\n/g, " "), // Remove line breaks from notes
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
