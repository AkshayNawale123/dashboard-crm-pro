import { useState } from "react";
import { FileText, CheckCircle, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";
import { cn } from "@/lib/utils";
import { ScheduleFollowupDialog } from "@/components/ScheduleFollowupDialog";
import { UpdateStatusDialog } from "@/components/UpdateStatusDialog";
import { AddNoteDialog } from "@/components/AddNoteDialog";

interface ClientDetailsDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDetailsDialog = ({
  client,
  open,
  onOpenChange,
}: ClientDetailsDialogProps) => {
  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

  if (!client) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold">{client.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Priority</span>
              <Badge variant={getPriorityVariant(client.priority)} className="uppercase">
                {client.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Project Value</p>
              <p className="text-2xl font-bold">{client.projectValue}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stage</p>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    getStageColor(client.stage)
                  )}
                />
                <p className="font-semibold">{client.stage}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={cn("font-semibold", getStatusColor(client.proposalStatus))}>
                {client.proposalStatus}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Priority</p>
              <Badge variant={getPriorityVariant(client.priority)} className="uppercase w-fit">
                {client.priority}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Contact Information</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 pl-7">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{client.contactPerson}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${client.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {client.email}
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
          </div>

          {/* Follow-up Management */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">Follow-up Management</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Follow-up</p>
                <p className="font-semibold text-lg">{client.lastFollowup}</p>
              </div>
              <div className="space-y-1 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Next Follow-up</p>
                <p className="font-semibold text-lg">{client.nextFollowup}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="font-semibold text-lg">Notes</h3>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
              <p className="text-sm">{client.notes}</p>
            </div>
          </div>

          {/* Activity History */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="font-semibold text-lg">Activity History</h3>
            <div className="space-y-3 pl-4">
              {client.history.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    {index < client.history.length - 1 && (
                      <div className="w-0.5 h-12 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">by {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={() => setFollowupDialogOpen(true)}
            >
              <Calendar className="h-4 w-4" />
              Schedule Follow-up
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => setStatusDialogOpen(true)}
            >
              <CheckCircle className="h-4 w-4" />
              Update Status
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              onClick={() => setNoteDialogOpen(true)}
            >
              <FileText className="h-4 w-4" />
              Add Note
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Action Dialogs */}
      <ScheduleFollowupDialog
        open={followupDialogOpen}
        onOpenChange={setFollowupDialogOpen}
        clientName={client.name}
      />
      <UpdateStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        clientName={client.name}
        currentStage={client.stage}
        currentStatus={client.proposalStatus}
      />
      <AddNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        clientName={client.name}
      />
    </Dialog>
  );
};
