import { DataTable, SortableHeader } from "@/components/DataTable";
import { StatusCell, StatusCode } from "@/components/StatusCell";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditableCustomFieldCell } from "@/components/EditableCustomFieldCell";
import { Plus, Filter, Settings } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EquipmentDetailModal } from "@/components/EquipmentDetailModal";
import { CustomFieldManager } from "@/components/CustomFieldManager";
import { useCustomFields } from "@/hooks/useCustomFields";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Equipment {
  id: string;
  name: string;
  type: string;
  siteId?: string | null;
  location: string;
  maintenance: StatusCode;
  err: StatusCode;
  hours: number;
  serialNumber: string;
  purchaseDate: string;
  operator?: string | null;
  warrantyStatus: string;
  isRental: boolean;
  lastReportBy?: string | null;
  lastReportHours?: number | null;
  lastReportDate?: string | null;
  notes?: string | null;
}

// Transform database isRental (number) to UI isRental (boolean)
function transformEquipmentFromAPI(data: any[]): Equipment[] {
  return data.map(item => ({
    ...item,
    isRental: item.isRental === 1,
  }));
}

export default function EquipmentPage() {
  const [location, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);

  const { customFields } = useCustomFields("equipment");
  
  const { data: customFieldValues = [] } = useQuery<any[]>({
    queryKey: ["/api/field-values"],
  });
  
  const { data: rawEquipment, isLoading } = useQuery<any[]>({
    queryKey: ["/api/equipment"],
  });
  
  const allEquipment = useMemo(() => {
    if (!rawEquipment) return [];
    return transformEquipmentFromAPI(rawEquipment);
  }, [rawEquipment]);
  
  const updateFieldValueMutation = useMutation({
    mutationFn: async ({ fieldId, equipmentId, value, fieldType }: { 
      fieldId: string; 
      equipmentId: string; 
      value: string | number; 
      fieldType: string;
    }) => {
      return await apiRequest("POST", "/api/field-values", {
        fieldId,
        equipmentId,
        textValue: fieldType === "text" ? String(value) : null,
        numberValue: fieldType === "number" ? Number(value) : null,
        selectValue: fieldType === "select" ? String(value) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/field-values"] });
    },
  });
  
  const handleRowClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDetailOpen(true);
  };

  // Handle deep-linking from map via query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const equipmentId = params.get('id');

    if (equipmentId && allEquipment.length > 0) {
      const equipment = allEquipment.find(eq => eq.id === equipmentId);
      if (equipment) {
        setSelectedEquipment(equipment);
        setDetailOpen(true);
        // Clear the query parameter after opening
        setLocation('/equipment', { replace: true });
      }
    }
  }, [allEquipment, setLocation]);

  const staticColumns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs font-mono text-muted-foreground">{row.original.id}</div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => <SortableHeader column={column}>Location</SortableHeader>,
      cell: ({ row }) => <div className="text-sm">{row.original.location}</div>,
    },
    {
      accessorKey: "maintenance",
      header: ({ column }) => <SortableHeader column={column}>Maintenance</SortableHeader>,
      cell: ({ row }) => <StatusCell status={row.original.maintenance} type="maintenance" />,
    },
    {
      accessorKey: "err",
      header: ({ column }) => <SortableHeader column={column}>ERR</SortableHeader>,
      cell: ({ row }) => <StatusCell status={row.original.err} type="err" />,
    },
    {
      accessorKey: "hours",
      header: ({ column }) => <SortableHeader column={column}>Hours</SortableHeader>,
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.hours.toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => <SortableHeader column={column}>Type</SortableHeader>,
      cell: ({ row }) => <div className="text-sm">{row.original.type}</div>,
    },
    {
      accessorKey: "operator",
      header: "Operator",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.operator || "-"}
        </div>
      ),
    },
  ];

  const dynamicCustomFieldColumns: ColumnDef<Equipment>[] = customFields.map((field) => ({
    id: `custom_${field.id}`,
    header: ({ column }) => <SortableHeader column={column}>{field.name}</SortableHeader>,
    cell: ({ row }) => {
      const equipmentId = row.original.id;
      const fieldValue = customFieldValues.find(
        (v: any) => v.fieldId === field.id && v.equipmentId === equipmentId
      );
      
      const currentValue = field.fieldType === "text" 
        ? fieldValue?.textValue 
        : field.fieldType === "number" 
        ? fieldValue?.numberValue 
        : fieldValue?.selectValue;

      return (
        <EditableCustomFieldCell
          fieldId={field.id}
          equipmentId={equipmentId}
          fieldType={field.fieldType}
          currentValue={currentValue}
          onSave={(value) => {
            updateFieldValueMutation.mutate({
              fieldId: field.id,
              equipmentId,
              value,
              fieldType: field.fieldType,
            });
          }}
        />
      );
    },
  }));

  const columns = [...staticColumns, ...dynamicCustomFieldColumns];

  const filteredEquipment = useMemo(() => {
    return allEquipment.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(search.toLowerCase()) ||
        eq.id.toLowerCase().includes(search.toLowerCase()) ||
        eq.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "critical" && (eq.maintenance === "R_3" || eq.err === "R_3")) ||
        (filter === "warning" && (eq.maintenance === "Y_2" || eq.err === "Y_2")) ||
        (filter === "good" && eq.maintenance === "G_1" && eq.err === "G_1");

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, allEquipment]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Equipment</h1>
          <p className="text-sm text-muted-foreground">
            {filteredEquipment.length} of {allEquipment.length} equipment
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCustomFieldsOpen(true)}
            data-testid="button-manage-fields"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Fields
          </Button>
          <Button data-testid="button-add-equipment">
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search equipment..."
          className="flex-1"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Equipment</SelectItem>
            <SelectItem value="critical">Critical (R_3)</SelectItem>
            <SelectItem value="warning">Warning (Y_2)</SelectItem>
            <SelectItem value="good">Good (G_1)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredEquipment} onRowClick={handleRowClick} />

      <EquipmentDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        equipment={selectedEquipment}
      />

      <CustomFieldManager
        open={customFieldsOpen}
        onOpenChange={setCustomFieldsOpen}
        entityType="equipment"
      />
    </div>
  );
}
