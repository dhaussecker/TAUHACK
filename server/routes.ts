import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertEquipmentSchema,
  insertMaintenanceSchema,
  insertSiteSchema,
  insertCustomFieldSchema,
  insertCustomFieldOptionSchema,
  insertCustomFieldValueSchema,
  insertSavedViewSchema,
  insertFormSubmissionSchema,
  insertFormResponseSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Equipment routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const siteId = req.query.siteId as string | undefined;
      const equipment = await storage.getAllEquipment(siteId);
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

  // Maintenance routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const equipmentId = req.query.equipmentId as string | undefined;
      const maintenance = await storage.getAllMaintenance(equipmentId);
      res.json(maintenance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/maintenance/:id", async (req, res) => {
    try {
      const maintenance = await storage.getMaintenance(req.params.id);
      if (!maintenance) {
        return res.status(404).json({ error: "Maintenance record not found" });
      }
      res.json(maintenance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const validated = insertMaintenanceSchema.parse(req.body);
      const maintenance = await storage.createMaintenance(validated);
      res.json(maintenance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/maintenance/:id", async (req, res) => {
    try {
      const validated = insertMaintenanceSchema.partial().parse(req.body);
      const maintenance = await storage.updateMaintenance(req.params.id, validated);
      res.json(maintenance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/maintenance/:id", async (req, res) => {
    try {
      await storage.deleteMaintenance(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sites routes
  app.get("/api/sites", async (req, res) => {
    try {
      const sites = await storage.getAllSites();
      res.json(sites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sites/:id", async (req, res) => {
    try {
      const site = await storage.getSite(req.params.id);
      if (!site) {
        return res.status(404).json({ error: "Site not found" });
      }
      res.json(site);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sites", async (req, res) => {
    try {
      const validated = insertSiteSchema.parse(req.body);
      const site = await storage.createSite(validated);
      res.json(site);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/sites/:id", async (req, res) => {
    try {
      const validated = insertSiteSchema.partial().parse(req.body);
      const site = await storage.updateSite(req.params.id, validated);
      res.json(site);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/sites/:id", async (req, res) => {
    try {
      await storage.deleteSite(req.params.id);
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

  // Form Submission routes
  app.get("/api/forms/submissions", async (req, res) => {
    try {
      const formType = req.query.formType as string | undefined;
      const submissions = await storage.getAllFormSubmissions(formType);
      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/forms/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getFormSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Form submission not found" });
      }
      res.json(submission);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forms/submissions", async (req, res) => {
    try {
      const validated = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(validated);
      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/forms/submissions/:id", async (req, res) => {
    try {
      const validated = insertFormSubmissionSchema.partial().parse(req.body);
      const submission = await storage.updateFormSubmission(req.params.id, validated);
      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/forms/submissions/:id", async (req, res) => {
    try {
      await storage.deleteFormSubmission(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Form Response routes
  app.get("/api/forms/submissions/:id/responses", async (req, res) => {
    try {
      const responses = await storage.getSubmissionResponses(req.params.id);
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forms/responses", async (req, res) => {
    try {
      const validated = insertFormResponseSchema.parse(req.body);
      const response = await storage.createFormResponse(validated);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/forms/submit", async (req, res) => {
    try {
      const schema = z.object({
        submission: insertFormSubmissionSchema,
        responses: z.array(insertFormResponseSchema.omit({ submissionId: true })),
      });
      const { submission, responses } = schema.parse(req.body);
      const result = await storage.submitFormWithResponses(submission, responses);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
