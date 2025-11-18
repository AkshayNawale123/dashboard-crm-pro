import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ScheduleFollowupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
}

export const ScheduleFollowupDialog = ({
  open,
  onOpenChange,
  clientName,
}: ScheduleFollowupDialogProps) => {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a follow-up date.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Follow-up Scheduled",
      description: `Follow-up with ${clientName} scheduled for ${new Date(date).toLocaleDateString()}.`,
    });

    setDate("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Follow-up - {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="followup-date">Follow-up Date *</Label>
            <Input
              id="followup-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followup-notes">Notes (optional)</Label>
            <Textarea
              id="followup-notes"
              placeholder="Add any notes or reminders for this follow-up..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>Schedule Follow-up</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
