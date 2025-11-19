import { Client, ClientHistory, InsertClient, InsertClientHistory, ClientWithHistory } from "@shared/schema";

export interface IStorage {
  getClients(): Promise<ClientWithHistory[]>;
  getClient(id: number): Promise<ClientWithHistory | null>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | null>;
  deleteClient(id: number): Promise<boolean>;
  addClientHistory(history: InsertClientHistory): Promise<ClientHistory>;
  getClientHistory(clientId: number): Promise<ClientHistory[]>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client> = new Map();
  private clientHistory: Map<number, ClientHistory> = new Map();
  private clientIdCounter = 1;
  private historyIdCounter = 1;

  constructor() {
    // Initialize with mock data
    this.seedData();
  }

  private seedData() {
    const mockClients = [
      {
        id: 1,
        name: "Acme Corporation",
        stage: "Qualified",
        stageColor: "bg-blue-500",
        lastFollowup: "11/15/2025",
        nextFollowup: "11/20/2025",
        proposalStatus: "In Negotiation",
        statusColor: "text-yellow-600",
        projectValue: "$250K",
        valueNumeric: 250000,
        priority: "high",
        daysInPipeline: 45,
        firstContactDate: "2025-10-04",
        contactPerson: "John Smith",
        email: "john@acme.com",
        phone: "+1 234-567-8900",
        notes: "Interested in enterprise package. Decision maker meeting scheduled.",
      },
      {
        id: 2,
        name: "TechStart Inc",
        stage: "Proposal Sent",
        stageColor: "bg-purple-500",
        lastFollowup: "11/16/2025",
        nextFollowup: "11/22/2025",
        proposalStatus: "Proposal Rejected",
        statusColor: "text-red-600",
        projectValue: "$180K",
        valueNumeric: 180000,
        priority: "medium",
        daysInPipeline: 32,
        firstContactDate: "2025-10-17",
        contactPerson: "Emily Chen",
        email: "emily@techstart.com",
        phone: "+1 234-567-8901",
        notes: "Budget concerns. Considering revised proposal with phased approach.",
      },
      {
        id: 3,
        name: "Global Solutions Ltd",
        stage: "Won",
        stageColor: "bg-green-500",
        lastFollowup: "11/17/2025",
        nextFollowup: "11/25/2025",
        proposalStatus: "On Hold",
        statusColor: "text-orange-600",
        projectValue: "$420K",
        valueNumeric: 420000,
        priority: "high",
        daysInPipeline: 67,
        firstContactDate: "2025-09-12",
        contactPerson: "Robert Taylor",
        email: "robert@globalsolutions.com",
        phone: "+1 234-567-8902",
        notes: "Large enterprise deal. Currently on hold pending Q1 budget approval.",
      },
      {
        id: 4,
        name: "FutureTech Systems",
        stage: "In Negotiation",
        stageColor: "bg-yellow-500",
        lastFollowup: "11/18/2025",
        nextFollowup: "11/21/2025",
        proposalStatus: "In Negotiation",
        statusColor: "text-yellow-600",
        projectValue: "$320K",
        valueNumeric: 320000,
        priority: "high",
        daysInPipeline: 28,
        firstContactDate: "2025-10-22",
        contactPerson: "David Wu",
        email: "david@futuretech.com",
        phone: "+1 234-567-8903",
        notes: "Technical requirements finalized. Discussing payment terms.",
      },
      {
        id: 5,
        name: "Innovation Hub",
        stage: "Lead",
        stageColor: "bg-slate-500",
        lastFollowup: "11/14/2025",
        nextFollowup: "11/19/2025",
        proposalStatus: "",
        statusColor: "text-muted-foreground",
        projectValue: "$95K",
        valueNumeric: 95000,
        priority: "low",
        daysInPipeline: 5,
        firstContactDate: "2025-11-09",
        contactPerson: "Lisa Anderson",
        email: "lisa@innovationhub.com",
        phone: "+1 234-567-8904",
        notes: "Initial contact made. Awaiting response on discovery call.",
      },
    ];

    const mockHistory = [
      { clientId: 1, date: "11/15/2025", action: "Follow-up call completed", user: "Sarah" },
      { clientId: 1, date: "11/10/2025", action: "Proposal sent", user: "Mike" },
      { clientId: 1, date: "11/05/2025", action: "Initial meeting", user: "Sarah" },
      { clientId: 2, date: "11/16/2025", action: "Rejection received - budget", user: "Mike" },
      { clientId: 2, date: "11/12/2025", action: "Proposal presented", user: "Sarah" },
      { clientId: 2, date: "11/08/2025", action: "Requirements gathering", user: "Mike" },
      { clientId: 3, date: "11/17/2025", action: "Contract signed", user: "Sarah" },
      { clientId: 3, date: "11/14/2025", action: "Final negotiations", user: "Mike" },
      { clientId: 3, date: "11/08/2025", action: "Proposal revision", user: "Sarah" },
      { clientId: 4, date: "11/18/2025", action: "Negotiation meeting", user: "Mike" },
      { clientId: 4, date: "11/15/2025", action: "Technical demo completed", user: "Sarah" },
      { clientId: 4, date: "11/10/2025", action: "Proposal delivered", user: "Mike" },
      { clientId: 5, date: "11/14/2025", action: "Follow-up email sent", user: "Sarah" },
      { clientId: 5, date: "11/09/2025", action: "First contact established", user: "Mike" },
    ];

    mockClients.forEach(client => {
      this.clients.set(client.id, client as Client);
    });

    mockHistory.forEach(history => {
      const historyEntry = { ...history, id: this.historyIdCounter++ };
      this.clientHistory.set(historyEntry.id, historyEntry as ClientHistory);
    });

    this.clientIdCounter = mockClients.length + 1;
  }

  async getClients(): Promise<ClientWithHistory[]> {
    const clientsArray = Array.from(this.clients.values());
    return Promise.all(
      clientsArray.map(async (client) => {
        const history = await this.getClientHistory(client.id);
        return {
          ...client,
          history: history.map(h => ({ date: h.date, action: h.action, user: h.user }))
        };
      })
    );
  }

  async getClient(id: number): Promise<ClientWithHistory | null> {
    const client = this.clients.get(id);
    if (!client) return null;

    const history = await this.getClientHistory(id);
    return {
      ...client,
      history: history.map(h => ({ date: h.date, action: h.action, user: h.user }))
    };
  }

  async createClient(client: InsertClient): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: this.clientIdCounter++,
    };
    this.clients.set(newClient.id, newClient);
    return newClient;
  }

  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | null> {
    const client = this.clients.get(id);
    if (!client) return null;

    const updated = { ...client, ...clientData };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  async addClientHistory(history: InsertClientHistory): Promise<ClientHistory> {
    const newHistory: ClientHistory = {
      ...history,
      id: this.historyIdCounter++,
    };
    this.clientHistory.set(newHistory.id, newHistory);
    return newHistory;
  }

  async getClientHistory(clientId: number): Promise<ClientHistory[]> {
    return Array.from(this.clientHistory.values()).filter(
      (h) => h.clientId === clientId
    );
  }
}

export const storage = new MemStorage();
