import {
  type User,
  type InsertUser,
  type Equipment,
  type InsertEquipment,
  type CustomField,
  type InsertCustomField,
  type CustomFieldOption,
  type InsertCustomFieldOption,
  type CustomFieldValue,
  type InsertCustomFieldValue,
  type SavedView,
  type InsertSavedView,
  type FormSubmission,
  type InsertFormSubmission,
  type FormResponse,
  type InsertFormResponse,
  users,
  equipment,
  customFields,
  customFieldOptions,
  customFieldValues,
  savedViews,
  formSubmissions,
  formResponses,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Equipment
  getAllEquipment(): Promise<Equipment[]>;
  getEquipment(id: string): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, equipment: Partial<InsertEquipment>): Promise<Equipment>;
  deleteEquipment(id: string): Promise<void>;

  // Custom Fields
  getAllCustomFields(entityType?: string): Promise<CustomField[]>;
  getCustomField(id: string): Promise<CustomField | undefined>;
  createCustomField(field: InsertCustomField): Promise<CustomField>;
  updateCustomField(id: string, field: Partial<InsertCustomField>): Promise<CustomField>;
  deleteCustomField(id: string): Promise<void>;

  // Custom Field Options
  getFieldOptions(fieldId: string): Promise<CustomFieldOption[]>;
  createFieldOption(option: InsertCustomFieldOption): Promise<CustomFieldOption>;
  updateFieldOption(id: string, option: Partial<InsertCustomFieldOption>): Promise<CustomFieldOption>;
  deleteFieldOption(id: string): Promise<void>;

  // Custom Field Values
  getEquipmentFieldValues(equipmentId: string): Promise<CustomFieldValue[]>;
  getFieldValues(fieldId: string): Promise<CustomFieldValue[]>;
  setFieldValue(value: InsertCustomFieldValue): Promise<CustomFieldValue>;
  deleteFieldValue(fieldId: string, equipmentId: string): Promise<void>;

  // Saved Views
  getAllViews(entityType?: string): Promise<SavedView[]>;
  getView(id: string): Promise<SavedView | undefined>;
  createView(view: InsertSavedView): Promise<SavedView>;
  updateView(id: string, view: Partial<InsertSavedView>): Promise<SavedView>;
  deleteView(id: string): Promise<void>;

  // Form Submissions
  getAllFormSubmissions(formType?: string): Promise<FormSubmission[]>;
  getFormSubmission(id: string): Promise<FormSubmission | undefined>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  updateFormSubmission(id: string, submission: Partial<InsertFormSubmission>): Promise<FormSubmission>;
  deleteFormSubmission(id: string): Promise<void>;

  // Form Responses
  getSubmissionResponses(submissionId: string): Promise<FormResponse[]>;
  createFormResponse(response: InsertFormResponse): Promise<FormResponse>;

  // Transactional Form Submission
  submitFormWithResponses(submission: InsertFormSubmission, responses: InsertFormResponse[]): Promise<{ submission: FormSubmission; responses: FormResponse[] }>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Equipment
  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipment(id: string): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item;
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const [item] = await db.insert(equipment).values(insertEquipment).returning();
    return item;
  }

  async updateEquipment(id: string, updates: Partial<InsertEquipment>): Promise<Equipment> {
    const [item] = await db.update(equipment).set(updates).where(eq(equipment.id, id)).returning();
    if (!item) throw new Error("Equipment not found");
    return item;
  }

  async deleteEquipment(id: string): Promise<void> {
    const result = await db.delete(equipment).where(eq(equipment.id, id)).returning();
    if (result.length === 0) throw new Error("Equipment not found");
  }

  // Custom Fields
  async getAllCustomFields(entityType?: string): Promise<CustomField[]> {
    if (entityType) {
      return await db.select().from(customFields).where(eq(customFields.entityType, entityType));
    }
    return await db.select().from(customFields);
  }

  async getCustomField(id: string): Promise<CustomField | undefined> {
    const [field] = await db.select().from(customFields).where(eq(customFields.id, id));
    return field;
  }

  async createCustomField(field: InsertCustomField): Promise<CustomField> {
    const [created] = await db.insert(customFields).values(field).returning();
    return created;
  }

  async updateCustomField(id: string, updates: Partial<InsertCustomField>): Promise<CustomField> {
    const [updated] = await db.update(customFields).set(updates).where(eq(customFields.id, id)).returning();
    if (!updated) throw new Error("Custom field not found");
    return updated;
  }

  async deleteCustomField(id: string): Promise<void> {
    const result = await db.delete(customFields).where(eq(customFields.id, id)).returning();
    if (result.length === 0) throw new Error("Custom field not found");
  }

  // Custom Field Options
  async getFieldOptions(fieldId: string): Promise<CustomFieldOption[]> {
    return await db.select().from(customFieldOptions).where(eq(customFieldOptions.fieldId, fieldId));
  }

  async createFieldOption(option: InsertCustomFieldOption): Promise<CustomFieldOption> {
    const [created] = await db.insert(customFieldOptions).values(option).returning();
    return created;
  }

  async updateFieldOption(id: string, updates: Partial<InsertCustomFieldOption>): Promise<CustomFieldOption> {
    const [updated] = await db.update(customFieldOptions).set(updates).where(eq(customFieldOptions.id, id)).returning();
    if (!updated) throw new Error("Field option not found");
    return updated;
  }

  async deleteFieldOption(id: string): Promise<void> {
    const result = await db.delete(customFieldOptions).where(eq(customFieldOptions.id, id)).returning();
    if (result.length === 0) throw new Error("Field option not found");
  }

  // Custom Field Values
  async getEquipmentFieldValues(equipmentId: string): Promise<CustomFieldValue[]> {
    return await db.select().from(customFieldValues).where(eq(customFieldValues.equipmentId, equipmentId));
  }

  async getFieldValues(fieldId: string): Promise<CustomFieldValue[]> {
    return await db.select().from(customFieldValues).where(eq(customFieldValues.fieldId, fieldId));
  }

  async setFieldValue(value: InsertCustomFieldValue): Promise<CustomFieldValue> {
    // Check if value already exists
    const [existing] = await db.select().from(customFieldValues)
      .where(and(
        eq(customFieldValues.fieldId, value.fieldId),
        eq(customFieldValues.equipmentId, value.equipmentId)
      ));

    if (existing) {
      // Update existing value
      const [updated] = await db.update(customFieldValues)
        .set(value)
        .where(eq(customFieldValues.id, existing.id))
        .returning();
      return updated;
    } else {
      // Insert new value
      const [created] = await db.insert(customFieldValues).values(value).returning();
      return created;
    }
  }

  async deleteFieldValue(fieldId: string, equipmentId: string): Promise<void> {
    await db.delete(customFieldValues).where(
      and(
        eq(customFieldValues.fieldId, fieldId),
        eq(customFieldValues.equipmentId, equipmentId)
      )
    );
  }

  // Saved Views
  async getAllViews(entityType?: string): Promise<SavedView[]> {
    if (entityType) {
      return await db.select().from(savedViews).where(eq(savedViews.entityType, entityType));
    }
    return await db.select().from(savedViews);
  }

  async getView(id: string): Promise<SavedView | undefined> {
    const [view] = await db.select().from(savedViews).where(eq(savedViews.id, id));
    return view;
  }

  async createView(view: InsertSavedView): Promise<SavedView> {
    const [created] = await db.insert(savedViews).values(view).returning();
    return created;
  }

  async updateView(id: string, updates: Partial<InsertSavedView>): Promise<SavedView> {
    const [updated] = await db.update(savedViews).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(savedViews.id, id)).returning();
    if (!updated) throw new Error("View not found");
    return updated;
  }

  async deleteView(id: string): Promise<void> {
    const result = await db.delete(savedViews).where(eq(savedViews.id, id)).returning();
    if (result.length === 0) throw new Error("View not found");
  }

  // Form Submissions
  async getAllFormSubmissions(formType?: string): Promise<FormSubmission[]> {
    if (formType) {
      return await db.select().from(formSubmissions).where(eq(formSubmissions.formType, formType));
    }
    return await db.select().from(formSubmissions);
  }

  async getFormSubmission(id: string): Promise<FormSubmission | undefined> {
    const [submission] = await db.select().from(formSubmissions).where(eq(formSubmissions.id, id));
    return submission;
  }

  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const [created] = await db.insert(formSubmissions).values(submission).returning();
    return created;
  }

  async updateFormSubmission(id: string, updates: Partial<InsertFormSubmission>): Promise<FormSubmission> {
    const [updated] = await db.update(formSubmissions).set(updates).where(eq(formSubmissions.id, id)).returning();
    if (!updated) throw new Error("Form submission not found");
    return updated;
  }

  async deleteFormSubmission(id: string): Promise<void> {
    const result = await db.delete(formSubmissions).where(eq(formSubmissions.id, id)).returning();
    if (result.length === 0) throw new Error("Form submission not found");
  }

  // Form Responses
  async getSubmissionResponses(submissionId: string): Promise<FormResponse[]> {
    return await db.select().from(formResponses).where(eq(formResponses.submissionId, submissionId));
  }

  async createFormResponse(response: InsertFormResponse): Promise<FormResponse> {
    const [created] = await db.insert(formResponses).values(response).returning();
    return created;
  }

  async submitFormWithResponses(submission: InsertFormSubmission, responses: InsertFormResponse[]): Promise<{ submission: FormSubmission; responses: FormResponse[] }> {
    return await db.transaction(async (tx) => {
      const [createdSubmission] = await tx.insert(formSubmissions).values(submission).returning();

      const createdResponses: FormResponse[] = [];
      for (const response of responses) {
        const [createdResponse] = await tx.insert(formResponses).values({
          ...response,
          submissionId: createdSubmission.id,
        }).returning();
        createdResponses.push(createdResponse);
      }

      if (submission.formType === "err" && submission.equipmentId) {
        await tx.update(equipment).set({ err: "R_3" }).where(eq(equipment.id, submission.equipmentId));
      }

      return { submission: createdSubmission, responses: createdResponses };
    });
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private equipment: Map<string, Equipment>;
  private customFields: Map<string, CustomField>;
  private customFieldOptions: Map<string, CustomFieldOption>;
  private customFieldValues: Map<string, CustomFieldValue>;
  private savedViews: Map<string, SavedView>;
  private formSubmissions: Map<string, FormSubmission>;
  private formResponses: Map<string, FormResponse>;

  constructor() {
    this.users = new Map();
    this.equipment = new Map();
    this.customFields = new Map();
    this.customFieldOptions = new Map();
    this.customFieldValues = new Map();
    this.savedViews = new Map();
    this.formSubmissions = new Map();
    this.formResponses = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Equipment
  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipment(id: string): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const item: Equipment = { ...insertEquipment } as Equipment;
    this.equipment.set(item.id, item);
    return item;
  }

  async updateEquipment(id: string, updates: Partial<InsertEquipment>): Promise<Equipment> {
    const existing = this.equipment.get(id);
    if (!existing) throw new Error("Equipment not found");
    const updated = { ...existing, ...updates };
    this.equipment.set(id, updated);
    return updated;
  }

  async deleteEquipment(id: string): Promise<void> {
    this.equipment.delete(id);
  }

  // Custom Fields
  async getAllCustomFields(entityType?: string): Promise<CustomField[]> {
    const all = Array.from(this.customFields.values());
    if (entityType) {
      return all.filter(f => f.entityType === entityType);
    }
    return all;
  }

  async getCustomField(id: string): Promise<CustomField | undefined> {
    return this.customFields.get(id);
  }

  async createCustomField(field: InsertCustomField): Promise<CustomField> {
    const id = randomUUID();
    const created: CustomField = {
      ...field,
      id,
      equipmentType: field.equipmentType ?? null,
      displayOrder: field.displayOrder ?? 0,
      metadata: field.metadata ?? null,
      createdAt: new Date(),
    };
    this.customFields.set(id, created);
    return created;
  }

  async updateCustomField(id: string, updates: Partial<InsertCustomField>): Promise<CustomField> {
    const existing = this.customFields.get(id);
    if (!existing) throw new Error("Custom field not found");
    const updated = { ...existing, ...updates };
    this.customFields.set(id, updated);
    return updated;
  }

  async deleteCustomField(id: string): Promise<void> {
    this.customFields.delete(id);
  }

  // Custom Field Options
  async getFieldOptions(fieldId: string): Promise<CustomFieldOption[]> {
    return Array.from(this.customFieldOptions.values()).filter(o => o.fieldId === fieldId);
  }

  async createFieldOption(option: InsertCustomFieldOption): Promise<CustomFieldOption> {
    const id = randomUUID();
    const created: CustomFieldOption = {
      ...option,
      id,
      displayOrder: option.displayOrder ?? 0,
    };
    this.customFieldOptions.set(id, created);
    return created;
  }

  async updateFieldOption(id: string, updates: Partial<InsertCustomFieldOption>): Promise<CustomFieldOption> {
    const existing = this.customFieldOptions.get(id);
    if (!existing) throw new Error("Field option not found");
    const updated = { ...existing, ...updates };
    this.customFieldOptions.set(id, updated);
    return updated;
  }

  async deleteFieldOption(id: string): Promise<void> {
    this.customFieldOptions.delete(id);
  }

  // Custom Field Values
  async getEquipmentFieldValues(equipmentId: string): Promise<CustomFieldValue[]> {
    return Array.from(this.customFieldValues.values()).filter(v => v.equipmentId === equipmentId);
  }

  async getFieldValues(fieldId: string): Promise<CustomFieldValue[]> {
    return Array.from(this.customFieldValues.values()).filter(v => v.fieldId === fieldId);
  }

  async setFieldValue(value: InsertCustomFieldValue): Promise<CustomFieldValue> {
    const existing = Array.from(this.customFieldValues.values()).find(
      v => v.fieldId === value.fieldId && v.equipmentId === value.equipmentId
    );

    if (existing) {
      const updated = { ...existing, ...value };
      this.customFieldValues.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const created: CustomFieldValue = {
        ...value,
        id,
        textValue: value.textValue ?? null,
        numberValue: value.numberValue ?? null,
        selectValue: value.selectValue ?? null,
      };
      this.customFieldValues.set(id, created);
      return created;
    }
  }

  async deleteFieldValue(fieldId: string, equipmentId: string): Promise<void> {
    const existing = Array.from(this.customFieldValues.entries()).find(
      ([_, v]) => v.fieldId === fieldId && v.equipmentId === equipmentId
    );
    if (existing) {
      this.customFieldValues.delete(existing[0]);
    }
  }

  // Saved Views
  async getAllViews(entityType?: string): Promise<SavedView[]> {
    const all = Array.from(this.savedViews.values());
    if (entityType) {
      return all.filter(v => v.entityType === entityType);
    }
    return all;
  }

  async getView(id: string): Promise<SavedView | undefined> {
    return this.savedViews.get(id);
  }

  async createView(view: InsertSavedView): Promise<SavedView> {
    const id = randomUUID();
    const created: SavedView = {
      ...view,
      id,
      filters: view.filters ?? null,
      sorts: view.sorts ?? null,
      visibleColumns: view.visibleColumns ?? null,
      createdBy: view.createdBy ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.savedViews.set(id, created);
    return created;
  }

  async updateView(id: string, updates: Partial<InsertSavedView>): Promise<SavedView> {
    const existing = this.savedViews.get(id);
    if (!existing) throw new Error("View not found");
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.savedViews.set(id, updated);
    return updated;
  }

  async deleteView(id: string): Promise<void> {
    this.savedViews.delete(id);
  }

  // Form Submissions
  async getAllFormSubmissions(formType?: string): Promise<FormSubmission[]> {
    const all = Array.from(this.formSubmissions.values());
    if (formType) {
      return all.filter(s => s.formType === formType);
    }
    return all;
  }

  async getFormSubmission(id: string): Promise<FormSubmission | undefined> {
    return this.formSubmissions.get(id);
  }

  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const id = randomUUID();
    const created: FormSubmission = {
      ...submission,
      id,
      equipmentId: submission.equipmentId ?? null,
      location: submission.location ?? null,
      notes: submission.notes ?? null,
      completedAt: submission.completedAt ?? null,
      submittedAt: new Date(),
    };
    this.formSubmissions.set(id, created);
    return created;
  }

  async updateFormSubmission(id: string, updates: Partial<InsertFormSubmission>): Promise<FormSubmission> {
    const existing = this.formSubmissions.get(id);
    if (!existing) throw new Error("Form submission not found");
    const updated = { ...existing, ...updates };
    this.formSubmissions.set(id, updated);
    return updated;
  }

  async deleteFormSubmission(id: string): Promise<void> {
    this.formSubmissions.delete(id);
  }

  // Form Responses
  async getSubmissionResponses(submissionId: string): Promise<FormResponse[]> {
    return Array.from(this.formResponses.values()).filter(
      r => r.submissionId === submissionId
    );
  }

  async createFormResponse(response: InsertFormResponse): Promise<FormResponse> {
    const id = randomUUID();
    const created: FormResponse = {
      ...response,
      id,
      fieldId: response.fieldId ?? null,
      textValue: response.textValue ?? null,
      numberValue: response.numberValue ?? null,
      selectValue: response.selectValue ?? null,
    };
    this.formResponses.set(id, created);
    return created;
  }

  async submitFormWithResponses(submission: InsertFormSubmission, responses: InsertFormResponse[]): Promise<{ submission: FormSubmission; responses: FormResponse[] }> {
    const submissionId = randomUUID();
    const createdSubmission: FormSubmission = {
      ...submission,
      id: submissionId,
      equipmentId: submission.equipmentId ?? null,
      location: submission.location ?? null,
      notes: submission.notes ?? null,
      completedAt: submission.completedAt ?? null,
      submittedAt: new Date(),
    };
    this.formSubmissions.set(submissionId, createdSubmission);

    const createdResponses: FormResponse[] = [];
    for (const response of responses) {
      const responseId = randomUUID();
      const createdResponse: FormResponse = {
        ...response,
        id: responseId,
        submissionId,
        fieldId: response.fieldId ?? null,
        textValue: response.textValue ?? null,
        numberValue: response.numberValue ?? null,
        selectValue: response.selectValue ?? null,
      };
      this.formResponses.set(responseId, createdResponse);
      createdResponses.push(createdResponse);
    }

    if (submission.formType === "err" && submission.equipmentId) {
      const equipmentItem = this.equipment.get(submission.equipmentId);
      if (equipmentItem) {
        this.equipment.set(submission.equipmentId, { ...equipmentItem, err: "R_3" });
      }
    }

    return { submission: createdSubmission, responses: createdResponses };
  }
}

// Use DbStorage for production
export const storage = new DbStorage();
