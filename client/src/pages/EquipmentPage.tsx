import { DataTable, SortableHeader } from "@/components/DataTable";
import { StatusCell, StatusCode } from "@/components/StatusCell";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, Settings } from "lucide-react";
import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EquipmentDetailModal } from "@/components/EquipmentDetailModal";
import { CustomFieldManager } from "@/components/CustomFieldManager";

interface Equipment {
  id: string;
  name: string;
  location: string;
  maintenance: StatusCode;
  err: StatusCode;
  hours: number;
  type: string;
  serialNumber: string;
  purchaseDate: string;
  operator?: string;
  warrantyStatus: "Active" | "Expired" | "N/A";
  isRental: boolean;
  lastReportBy?: string;
  lastReportHours?: number;
  lastReportDate?: string;
  notes?: string;
}

export default function EquipmentPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);

  const allEquipment: Equipment[] = [
    {
      id: "EX-2024-001",
      name: "CAT 320 Excavator",
      type: "Excavator",
      location: "Downtown Build",
      maintenance: "G_1",
      err: "G_1",
      hours: 1245,
      serialNumber: "CAT320GC2024001",
      purchaseDate: "Jan 15, 2024",
      operator: "John Smith",
      warrantyStatus: "Active",
      isRental: false,
      lastReportBy: "John Smith",
      lastReportHours: 1245,
      lastReportDate: "Nov 7, 2025",
      notes: "New machine, running smoothly",
    },
    {
      id: "EX-2023-087",
      name: "Volvo EC220E",
      type: "Excavator",
      location: "Airport Expansion",
      maintenance: "Y_2",
      err: "G_1",
      hours: 2890,
      serialNumber: "VLV220E2023087",
      purchaseDate: "Jun 5, 2023",
      warrantyStatus: "Active",
      isRental: false,
      lastReportBy: "Sarah Chen",
      lastReportHours: 2890,
      lastReportDate: "Nov 6, 2025",
    },
    {
      id: "LP-2023-042",
      name: "Graco LineDriver",
      type: "Line Painter",
      location: "Highway 401 Project",
      maintenance: "Y_2",
      err: "Y_2",
      hours: 3890,
      serialNumber: "GLD2023042",
      purchaseDate: "Mar 22, 2023",
      warrantyStatus: "Expired",
      isRental: false,
      lastReportBy: "Mike Torres",
      lastReportHours: 3890,
      lastReportDate: "Nov 5, 2025",
      notes: "AC unit needs repair, not critical",
    },
    {
      id: "TR-2024-015",
      name: "Ford F-550",
      type: "Truck",
      location: "Unassigned",
      maintenance: "R_3",
      err: "R_3",
      hours: 5420,
      serialNumber: "1FDUF5HT8FDA12345",
      purchaseDate: "Feb 10, 2024",
      operator: "Sarah Johnson",
      warrantyStatus: "Active",
      isRental: false,
      lastReportBy: "Sarah Johnson",
      lastReportHours: 5420,
      lastReportDate: "Nov 4, 2025",
      notes: "Hydraulic hose broke - URGENT",
    },
    {
      id: "TR-2024-022",
      name: "RAM 3500",
      type: "Truck",
      location: "Residential Complex",
      maintenance: "G_1",
      err: "G_1",
      hours: 1567,
      serialNumber: "3C63R3HL2FG567890",
      purchaseDate: "Apr 8, 2024",
      operator: "Mike Torres",
      warrantyStatus: "Active",
      isRental: false,
      lastReportBy: "Mike Torres",
      lastReportHours: 1567,
      lastReportDate: "Nov 7, 2025",
    },
    {
      id: "SK-2023-031",
      name: "Bobcat T770",
      type: "Skid Steer",
      location: "Downtown Build",
      maintenance: "G_1",
      err: "G_1",
      hours: 4230,
      serialNumber: "BBT770-2023031",
      purchaseDate: "May 12, 2023",
      warrantyStatus: "Expired",
      isRental: true,
      lastReportBy: "James Wilson",
      lastReportHours: 4230,
      lastReportDate: "Nov 3, 2025",
    },
    {
      id: "BH-2023-012",
      name: "CAT 420F Backhoe",
      type: "Backhoe",
      location: "Airport Expansion",
      maintenance: "R_3",
      err: "G_1",
      hours: 3650,
      serialNumber: "CAT420F2023012",
      purchaseDate: "Aug 15, 2023",
      warrantyStatus: "Active",
      isRental: false,
      lastReportBy: "Sarah Chen",
      lastReportHours: 3650,
      lastReportDate: "Nov 6, 2025",
    },
    {
      id: "CMP-2024-005",
      name: "Wacker Neuson Roller",
      type: "Compactor",
      location: "Highway 401 Project",
      maintenance: "G_1",
      err: "Y_2",
      hours: 890,
      serialNumber: "WNR2024005",
      purchaseDate: "Jul 20, 2024",
      warrantyStatus: "Active",
      isRental: true,
      lastReportBy: "Mike Torres",
      lastReportHours: 890,
      lastReportDate: "Nov 7, 2025",
      notes: "Minor vibration issue, monitoring",
    },
  ];

  const columns: ColumnDef<Equipment>[] = [
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

  const handleRowClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDetailOpen(true);
  };

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
