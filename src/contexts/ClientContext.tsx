import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Client } from "@/types/client";
import { mockClients } from "@/data/mockClients";

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "daysInPipeline">) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  getClientById: (id: number) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const STORAGE_KEY = "crm_clients";

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockClients;
      }
    }
    return mockClients;
  });

  // Persist to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData: Omit<Client, "id" | "daysInPipeline">) => {
    const newId = Math.max(0, ...clients.map((c) => c.id)) + 1;
    const daysInPipeline = Math.floor(
      (new Date().getTime() - new Date(clientData.firstContactDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const newClient: Client = {
      ...clientData,
      id: newId,
      daysInPipeline,
      history: [
        {
          date: new Date().toLocaleDateString(),
          action: "Client created",
          user: "Sales Team",
        },
        ...clientData.history,
      ],
    };

    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (id: number, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id === id) {
          const updatedClient = { ...client, ...updates };
          
          // Recalculate days in pipeline if first contact date changed
          if (updates.firstContactDate) {
            updatedClient.daysInPipeline = Math.floor(
              (new Date().getTime() - new Date(updates.firstContactDate).getTime()) / (1000 * 60 * 60 * 24)
            );
          }

          // Add history entry for update
          updatedClient.history = [
            {
              date: new Date().toLocaleDateString(),
              action: "Client updated",
              user: "Sales Team",
            },
            ...client.history,
          ];

          return updatedClient;
        }
        return client;
      })
    );
  };

  const deleteClient = (id: number) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const getClientById = (id: number) => {
    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{ clients, addClient, updateClient, deleteClient, getClientById }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClients must be used within ClientProvider");
  }
  return context;
};
