import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
}

export const AddNoteDialog = ({
  open,
  onOpenChange,
  clientName,
}: AddNoteDialogProps) => {
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!note.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a note before saving.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note Added",
      description: `Note added to ${clientName}.`,
    });

    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Add Note - {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note-content">Note *</Label>
            <Textarea
              id="note-content"
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNote}>Add Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
