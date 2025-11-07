import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface CustomField {
  id: string;
  name: string;
  fieldType: "text" | "number" | "select";
  entityType: string;
  equipmentType?: string | null;
  displayOrder: number;
  metadata?: any;
  createdAt: Date;
}

export interface CustomFieldOption {
  id: string;
  fieldId: string;
  label: string;
  value: string;
  displayOrder: number;
}

export interface CustomFieldValue {
  id: string;
  fieldId: string;
  equipmentId: string;
  textValue: string | null;
  numberValue: number | null;
  selectValue: string | null;
}

export function useCustomFields(entityType: string) {
  const { data: customFields = [] } = useQuery<CustomField[]>({
    queryKey: [`/api/custom-fields?entityType=${entityType}`],
  });

  return { customFields };
}

export function useFieldOptions(fieldId: string | null) {
  const { data: options = [] } = useQuery<CustomFieldOption[]>({
    queryKey: ["/api/custom-fields", fieldId, "options"],
    enabled: !!fieldId,
  });

  return { options };
}

export function useEquipmentFieldValues(equipmentId: string | null) {
  const { data: values = [] } = useQuery<CustomFieldValue[]>({
    queryKey: ["/api/equipment", equipmentId, "field-values"],
    enabled: !!equipmentId,
  });

  return { values };
}

export function useUpdateFieldValue() {
  return useMutation({
    mutationFn: async (data: {
      fieldId: string;
      equipmentId: string;
      textValue?: string | null;
      numberValue?: number | null;
      selectValue?: string | null;
    }) => {
      const response = await apiRequest("POST", "/api/field-values", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
    },
  });
}
