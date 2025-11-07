import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CustomField {
  id: string;
  name: string;
  fieldType: string;
  entityType: string;
  equipmentType?: string | null;
  displayOrder: number;
  metadata?: any;
  createdAt: Date;
}

interface CustomFieldOption {
  id: string;
  fieldId: string;
  label: string;
  value: string;
  displayOrder: number;
}

interface CustomFieldManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string; // 'equipment', 'maintenance', 'sites'
}

export function CustomFieldManager({
  open,
  onOpenChange,
  entityType,
}: CustomFieldManagerProps) {
  const { toast } = useToast();
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<string>("text");
  const [fieldOptions, setFieldOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [newOptionLabel, setNewOptionLabel] = useState("");

  // Fetch custom fields
  const { data: customFields = [] } = useQuery<CustomField[]>({
    queryKey: ["/api/custom-fields", { entityType }],
  });

  // Create field mutation
  const createFieldMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/custom-fields", data);
      return await response.json();
    },
    onSuccess: async (field: any) => {
      // If it's a select field, create the options
      if (field.fieldType === "select" && fieldOptions.length > 0) {
        for (let index = 0; index < fieldOptions.length; index++) {
          const option = fieldOptions[index];
          const res = await apiRequest("POST", `/api/custom-fields/${field.id}/options`, {
            label: option.label,
            value: option.value,
            displayOrder: index,
          });
          await res.json();
        }
      }
      await queryClient.invalidateQueries({
        queryKey: ["/api/custom-fields", { entityType }],
      });
      toast({
        title: "Field created",
        description: `Custom field "${field.name}" has been created successfully.`,
      });
      setEditFieldOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create custom field",
        variant: "destructive",
      });
    },
  });

  // Delete field mutation
  const deleteFieldMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/custom-fields/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/custom-fields", { entityType }],
      });
      toast({
        title: "Field deleted",
        description: "Custom field has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete custom field",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setNewFieldName("");
    setNewFieldType("text");
    setFieldOptions([]);
    setNewOptionLabel("");
    setEditingField(null);
  };

  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return;
    
    const value = newOptionLabel.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    setFieldOptions([...fieldOptions, { label: newOptionLabel, value }]);
    setNewOptionLabel("");
  };

  const handleRemoveOption = (index: number) => {
    setFieldOptions(fieldOptions.filter((_, i) => i !== index));
  };

  const handleCreateField = () => {
    if (!newFieldName.trim()) {
      toast({
        title: "Error",
        description: "Field name is required",
        variant: "destructive",
      });
      return;
    }

    createFieldMutation.mutate({
      name: newFieldName,
      fieldType: newFieldType,
      entityType,
      displayOrder: customFields.length,
    });
  };

  const handleDeleteField = (field: CustomField) => {
    if (confirm(`Are you sure you want to delete the field "${field.name}"?`)) {
      deleteFieldMutation.mutate(field.id);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto" data-testid="sheet-custom-fields">
          <SheetHeader>
            <SheetTitle>Manage Custom Fields</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Add custom columns to your {entityType} table
            </p>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Button
              onClick={() => setEditFieldOpen(true)}
              className="w-full"
              data-testid="button-add-field"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Field
            </Button>

            <div className="space-y-3">
              {customFields.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No custom fields yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Add Custom Field" to create your first field
                  </p>
                </Card>
              ) : (
                customFields.map((field) => (
                  <Card key={field.id} className="p-4" data-testid={`field-card-${field.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{field.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {field.fieldType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {field.entityType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteField(field)}
                          data-testid={`button-delete-${field.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={editFieldOpen} onOpenChange={setEditFieldOpen}>
        <DialogContent data-testid="dialog-add-field">
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                placeholder="e.g., Welding, Staging Status"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                data-testid="input-field-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type</Label>
              <Select value={newFieldType} onValueChange={setNewFieldType}>
                <SelectTrigger data-testid="select-field-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Dropdown (Select)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newFieldType === "select" && (
              <div className="space-y-3">
                <Label>Dropdown Options</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 1-submitted, 2-diagnosed-need parts"
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                    data-testid="input-option-label"
                  />
                  <Button
                    type="button"
                    onClick={handleAddOption}
                    variant="outline"
                    data-testid="button-add-option"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {fieldOptions.length > 0 && (
                  <div className="space-y-2">
                    {fieldOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                        data-testid={`option-${index}`}
                      >
                        <span className="text-sm">{option.label}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveOption(index)}
                          data-testid={`button-remove-option-${index}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditFieldOpen(false);
                resetForm();
              }}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateField}
              disabled={createFieldMutation.isPending}
              data-testid="button-create-field"
            >
              {createFieldMutation.isPending ? "Creating..." : "Create Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
