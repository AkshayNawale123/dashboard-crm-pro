import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useClients } from "@/contexts/ClientContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

const clientSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  stage: z.enum(["Lead", "Qualified", "Proposal Sent", "In Negotiation", "Won"]),
  proposalStatus: z.enum(["", "In Negotiation", "On Hold", "Proposal Rejected"]),
  priority: z.enum(["low", "medium", "high"]),
  projectValue: z.string().min(1, "Project value is required"),
  valueNumeric: z.number().min(0, "Value must be positive"),
  firstContactDate: z.string().min(1, "First contact date is required"),
  lastFollowup: z.string().min(1, "Last follow-up date is required"),
  nextFollowup: z.string().min(1, "Next follow-up date is required"),
  notes: z.string(),
});

type ClientFormData = z.infer<typeof clientSchema>;

const stageColors: Record<string, string> = {
  Lead: "bg-slate-500",
  Qualified: "bg-blue-500",
  "Proposal Sent": "bg-purple-500",
  "In Negotiation": "bg-yellow-500",
  Won: "bg-green-500",
};

const statusColors: Record<string, string> = {
  "": "text-muted-foreground",
  "In Negotiation": "text-yellow-600",
  "On Hold": "text-orange-600",
  "Proposal Rejected": "text-red-600",
};

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const { toast } = useToast();

  const client = id ? getClientById(parseInt(id)) : null;

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      stage: "Lead",
      proposalStatus: "",
      priority: "medium",
      projectValue: "",
      valueNumeric: 0,
      firstContactDate: new Date().toISOString().split("T")[0],
      lastFollowup: new Date().toISOString().split("T")[0],
      nextFollowup: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        contactPerson: client.contactPerson,
        email: client.email,
        phone: client.phone,
        stage: client.stage as any,
        proposalStatus: client.proposalStatus as any,
        priority: client.priority as any,
        projectValue: client.projectValue,
        valueNumeric: client.valueNumeric,
        firstContactDate: client.firstContactDate,
        lastFollowup: client.lastFollowup,
        nextFollowup: client.nextFollowup,
        notes: client.notes,
      });
    }
  }, [client, form]);

  if (!client) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Client not found</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/manage-clients")}>
                Back to Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: ClientFormData) => {
    const stageColor = stageColors[data.stage] || "bg-slate-500";
    const statusColor = statusColors[data.proposalStatus] || "text-muted-foreground";

    updateClient(client.id, {
      ...data,
      stageColor,
      statusColor,
    });

    toast({
      title: "Client Updated",
      description: `${data.name} has been updated successfully.`,
    });

    navigate("/manage-clients");
  };

  const handleValueChange = (value: string) => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    form.setValue("valueNumeric", isNaN(numeric) ? 0 : numeric);
    form.setValue("projectValue", value);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
          <CardDescription>Update the details for {client.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@acme.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234-567-8900" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Sales Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sales Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Lead">Lead</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                            <SelectItem value="In Negotiation">In Negotiation</SelectItem>
                            <SelectItem value="Won">Won</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proposalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposal Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            <SelectItem value="In Negotiation">In Negotiation</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Proposal Rejected">Proposal Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Value</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$250K"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleValueChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>e.g., $250K or $1.5M</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="firstContactDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Contact Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastFollowup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Follow-up</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nextFollowup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Follow-up</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about this client..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" size="lg">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/manage-clients")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
