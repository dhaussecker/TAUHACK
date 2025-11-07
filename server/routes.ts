import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertEquipmentSchema,
  insertCustomFieldSchema,
  insertCustomFieldOptionSchema,
  insertCustomFieldValueSchema,
  insertSavedViewSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Equipment routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const equipment = await storage.getAllEquipment();
      res.json(equipment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const equipment = await storage.getEquipment(req.params.id);
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const validated = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(validated);
      res.json(equipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/equipment/:id", async (req, res) => {
    try {
      const validated = insertEquipmentSchema.partial().parse(req.body);
      const equipment = await storage.updateEquipment(req.params.id, validated);
      res.json(equipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/equipment/:id", async (req, res) => {
    try {
      await storage.deleteEquipment(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Custom fields routes
  app.get("/api/custom-fields", async (req, res) => {
    try {
      const entityType = req.query.entityType as string | undefined;
      const fields = await storage.getAllCustomFields(entityType);
      res.json(fields);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/custom-fields/:id", async (req, res) => {
    try {
      const field = await storage.getCustomField(req.params.id);
      if (!field) {
        return res.status(404).json({ error: "Custom field not found" });
      }
      res.json(field);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/custom-fields", async (req, res) => {
    try {
      const validated = insertCustomFieldSchema.parse(req.body);
      const field = await storage.createCustomField(validated);
      res.json(field);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/custom-fields/:id", async (req, res) => {
    try {
      const validated = insertCustomFieldSchema.partial().parse(req.body);
      const field = await storage.updateCustomField(req.params.id, validated);
      res.json(field);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/custom-fields/:id", async (req, res) => {
    try {
      await storage.deleteCustomField(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Custom field options routes
  app.get("/api/custom-fields/:fieldId/options", async (req, res) => {
    try {
      const options = await storage.getFieldOptions(req.params.fieldId);
      res.json(options);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/custom-fields/:fieldId/options", async (req, res) => {
    try {
      const validated = insertCustomFieldOptionSchema.parse({
        ...req.body,
        fieldId: req.params.fieldId,
      });
      const option = await storage.createFieldOption(validated);
      res.json(option);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/custom-field-options/:id", async (req, res) => {
    try {
      const validated = insertCustomFieldOptionSchema.partial().parse(req.body);
      const option = await storage.updateFieldOption(req.params.id, validated);
      res.json(option);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/custom-field-options/:id", async (req, res) => {
    try {
      await storage.deleteFieldOption(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Custom field values routes
  app.get("/api/equipment/:equipmentId/field-values", async (req, res) => {
    try {
      const values = await storage.getEquipmentFieldValues(req.params.equipmentId);
      res.json(values);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/custom-fields/:fieldId/values", async (req, res) => {
    try {
      const values = await storage.getFieldValues(req.params.fieldId);
      res.json(values);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/field-values", async (req, res) => {
    try {
      const validated = insertCustomFieldValueSchema.parse(req.body);
      const value = await storage.setFieldValue(validated);
      res.json(value);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/field-values", async (req, res) => {
    try {
      const schema = z.object({
        fieldId: z.string(),
        equipmentId: z.string(),
      });
      const { fieldId, equipmentId } = schema.parse(req.body);
      await storage.deleteFieldValue(fieldId, equipmentId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Saved views routes
  app.get("/api/saved-views", async (req, res) => {
    try {
      const entityType = req.query.entityType as string | undefined;
      const views = await storage.getAllViews(entityType);
      res.json(views);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-views/:id", async (req, res) => {
    try {
      const view = await storage.getView(req.params.id);
      if (!view) {
        return res.status(404).json({ error: "View not found" });
      }
      res.json(view);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/saved-views", async (req, res) => {
    try {
      const validated = insertSavedViewSchema.parse(req.body);
      const view = await storage.createView(validated);
      res.json(view);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/saved-views/:id", async (req, res) => {
    try {
      const validated = insertSavedViewSchema.partial().parse(req.body);
      const view = await storage.updateView(req.params.id, validated);
      res.json(view);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/saved-views/:id", async (req, res) => {
    try {
      await storage.deleteView(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
