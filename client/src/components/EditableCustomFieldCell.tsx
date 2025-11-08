import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFieldOptions } from "@/hooks/useCustomFields";

interface EditableCustomFieldCellProps {
  fieldId: string;
  equipmentId: string;
  fieldType: "text" | "number" | "select";
  currentValue: string | number | null | undefined;
  onSave: (value: string | number) => void;
}

export function EditableCustomFieldCell({
  fieldId,
  equipmentId,
  fieldType,
  currentValue,
  onSave,
}: EditableCustomFieldCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentValue ?? "");
  const { options } = useFieldOptions(fieldType === "select" ? fieldId : null);

  useEffect(() => {
    setEditValue(currentValue ?? "");
  }, [currentValue]);

  const handleSave = () => {
    if (editValue !== currentValue) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const displayValue = currentValue !== null && currentValue !== undefined && currentValue !== "" 
    ? String(currentValue) 
    : "-";

  if (fieldType === "select") {
    const selectValue = currentValue !== null && currentValue !== undefined && currentValue !== "" 
      ? String(currentValue) 
      : "none";
    
    return (
      <Select
        value={selectValue}
        onValueChange={(value) => onSave(value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8 border-none focus:ring-0" data-testid={`select-${fieldId}-${equipmentId}`}>
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (isEditing) {
    return (
      <Input
        type={fieldType === "number" ? "number" : "text"}
        value={editValue}
        onChange={(e) => setEditValue(fieldType === "number" ? e.target.valueAsNumber : e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") {
            setEditValue(currentValue ?? "");
            setIsEditing(false);
          }
        }}
        className="h-8 text-sm"
        autoFocus
        data-testid={`input-${fieldId}-${equipmentId}`}
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="cursor-text text-sm text-muted-foreground hover-elevate px-2 py-1 rounded"
      data-testid={`cell-${fieldId}-${equipmentId}`}
    >
      {displayValue}
    </div>
  );
}
