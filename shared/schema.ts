import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Equipment table
export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  maintenance: text("maintenance").notNull(), // G_1, Y_2, R_3
  err: text("err").notNull(), // G_1, Y_2, R_3
  hours: integer("hours").notNull().default(0),
  serialNumber: text("serial_number").notNull(),
  purchaseDate: text("purchase_date").notNull(),
  operator: text("operator"),
  warrantyStatus: text("warranty_status").notNull().default("N/A"),
  isRental: integer("is_rental").notNull().default(0), // 0 or 1 for boolean
  lastReportBy: text("last_report_by"),
  lastReportHours: integer("last_report_hours"),
  lastReportDate: text("last_report_date"),
  notes: text("notes"),
});

export const insertEquipmentSchema = createInsertSchema(equipment);
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

// Custom field definitions
export const customFields = pgTable("custom_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fieldType: text("field_type").notNull(), // 'text', 'number', 'select'
  entityType: text("entity_type").notNull(), // 'equipment', 'maintenance', 'sites'
  equipmentType: text("equipment_type"), // optional filter (e.g., 'Excavator')
  displayOrder: integer("display_order").notNull().default(0),
  metadata: jsonb("metadata"), // for additional config
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCustomFieldSchema = createInsertSchema(customFields).omit({
  id: true,
  createdAt: true,
});

export type InsertCustomField = z.infer<typeof insertCustomFieldSchema>;
export type CustomField = typeof customFields.$inferSelect;

// Custom field options (for select/dropdown fields)
export const customFieldOptions = pgTable("custom_field_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // Display text (e.g., "1-submitted")
  value: text("value").notNull(), // Internal value (e.g., "submitted")
  displayOrder: integer("display_order").notNull().default(0),
});

export const insertCustomFieldOptionSchema = createInsertSchema(customFieldOptions).omit({
  id: true,
});

export type InsertCustomFieldOption = z.infer<typeof insertCustomFieldOptionSchema>;
export type CustomFieldOption = typeof customFieldOptions.$inferSelect;

// Custom field values
export const customFieldValues = pgTable("custom_field_values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
  equipmentId: varchar("equipment_id").notNull().references(() => equipment.id, { onDelete: "cascade" }),
  textValue: text("text_value"),
  numberValue: integer("number_value"),
  selectValue: text("select_value"),
}, (table) => ({
  // Ensure only one value per equipment per field
  uniqueFieldEquipment: unique().on(table.fieldId, table.equipmentId),
}));

export const insertCustomFieldValueSchema = createInsertSchema(customFieldValues).omit({
  id: true,
});

export type InsertCustomFieldValue = z.infer<typeof insertCustomFieldValueSchema>;
export type CustomFieldValue = typeof customFieldValues.$inferSelect;

// Saved views
export const savedViews = pgTable("saved_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  entityType: text("entity_type").notNull(), // 'equipment', 'maintenance', 'sites'
  filters: jsonb("filters"), // Array of filter configs
  sorts: jsonb("sorts"), // Array of sort configs
  visibleColumns: jsonb("visible_columns"), // Array of column IDs
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSavedViewSchema = createInsertSchema(savedViews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSavedView = z.infer<typeof insertSavedViewSchema>;
export type SavedView = typeof savedViews.$inferSelect;
