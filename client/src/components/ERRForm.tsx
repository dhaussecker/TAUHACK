import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCustomFields } from "@/hooks/useCustomFields";
import { Loader2 } from "lucide-react";

const errFormSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  submittedBy: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().min(1, "Please describe the issue"),
  customFields: z.record(z.string(), z.union([z.string(), z.number()])),
});

type ERRFormData = z.infer<typeof errFormSchema>;

interface ERRFormProps {
  onSuccess: () => void;
}

export function ERRForm({ onSuccess }: ERRFormProps) {
  const { toast } = useToast();
  const { customFields: maintenanceFields } = useCustomFields("maintenance");

  // Get equipment list
  const { data: equipmentList = [] } = useQuery<any[]>({
    queryKey: ["/api/equipment"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ERRFormData>({
    resolver: zodResolver(errFormSchema),
    defaultValues: {
      customFields: {},
    },
  });

  const customFieldsValue = watch("customFields");

  const submitMutation = useMutation({
    mutationFn: async (data: ERRFormData) => {
      // Create form submission
      const submissionRes = await apiRequest("POST", "/api/forms/submissions", {
        formType: "err",
        equipmentId: data.equipmentId,
        submittedBy: data.submittedBy,
        location: data.location,
        notes: data.notes,
        status: "pending",
      });
      const submission = await submissionRes.json();

      // Create form responses for custom fields
      if (maintenanceFields.length > 0) {
        for (const field of maintenanceFields) {
          const value = data.customFields[field.id];
          if (value !== undefined && value !== "") {
            await apiRequest("POST", "/api/forms/responses", {
              submissionId: submission.id,
              fieldId: field.id,
              fieldName: field.name,
              textValue: field.fieldType === "text" ? String(value) : null,
              numberValue: field.fieldType === "number" ? Number(value) : null,
              selectValue: field.fieldType === "select" ? String(value) : null,
            });
          }
        }
      }

      // Update equipment ERR status to red
      await apiRequest("PATCH", `/api/equipment/${data.equipmentId}`, {
        err: "R_3",
      });

      return submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forms/submissions"] });
      toast({
        title: "ERR Submitted",
        description: "Equipment repair request has been submitted successfully.",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit ERR",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ERRFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="equipmentId">Equipment *</Label>
            <Select onValueChange={(value) => setValue("equipmentId", value)}>
              <SelectTrigger data-testid="select-equipment">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentList.map((eq: any) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} ({eq.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.equipmentId && (
              <p className="text-sm text-red-600">{errors.equipmentId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="submittedBy">Submitted By *</Label>
            <Input
              id="submittedBy"
              {...register("submittedBy")}
              placeholder="Your name"
              data-testid="input-submitted-by"
            />
            {errors.submittedBy && (
              <p className="text-sm text-red-600">{errors.submittedBy.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Equipment location"
              data-testid="input-location"
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="notes">Issue Description *</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Describe the equipment issue in detail..."
            rows={4}
            data-testid="textarea-notes"
          />
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </Card>

      {/* Maintenance Fields as Questions */}
      {maintenanceFields.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maintenanceFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                {field.fieldType === "text" && (
                  <Input
                    id={`field-${field.id}`}
                    onChange={(e) =>
                      setValue(`customFields.${field.id}`, e.target.value)
                    }
                    data-testid={`input-custom-${field.id}`}
                  />
                )}
                {field.fieldType === "number" && (
                  <Input
                    id={`field-${field.id}`}
                    type="number"
                    onChange={(e) =>
                      setValue(`customFields.${field.id}`, Number(e.target.value))
                    }
                    data-testid={`input-custom-${field.id}`}
                  />
                )}
                {field.fieldType === "select" && (
                  <Select
                    onValueChange={(value) =>
                      setValue(`customFields.${field.id}`, value)
                    }
                  >
                    <SelectTrigger data-testid={`select-custom-${field.id}`}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={submitMutation.isPending}
          data-testid="button-submit-err"
        >
          {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Submit ERR
        </Button>
      </div>
    </form>
  );
}
