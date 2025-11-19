import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  stage: text("stage").notNull(),
  stageColor: text("stage_color").notNull(),
  lastFollowup: text("last_followup").notNull(),
  nextFollowup: text("next_followup").notNull(),
  proposalStatus: text("proposal_status").notNull(),
  statusColor: text("status_color").notNull(),
  projectValue: text("project_value").notNull(),
  valueNumeric: integer("value_numeric").notNull(),
  priority: text("priority").notNull(),
  daysInPipeline: integer("days_in_pipeline").notNull(),
  firstContactDate: text("first_contact_date").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes").notNull(),
});

export const clientHistory = pgTable("client_history", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  date: text("date").notNull(),
  action: text("action").notNull(),
  user: text("user").notNull(),
});

export type Client = typeof clients.$inferSelect;
export type ClientHistory = typeof clientHistory.$inferSelect;

export const insertClientSchema = createInsertSchema(clients).omit({ id: true });
export const insertClientHistorySchema = createInsertSchema(clientHistory).omit({ id: true });

export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertClientHistory = z.infer<typeof insertClientHistorySchema>;

// Extended client type with history
export type ClientWithHistory = Client & {
  history: Array<{
    date: string;
    action: string;
    user: string;
  }>;
};
