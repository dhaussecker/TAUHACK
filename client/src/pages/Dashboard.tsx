import { KPICard } from "@/components/KPICard";
import { DataTable, SortableHeader } from "@/components/DataTable";
import { StatusCell, StatusCode } from "@/components/StatusCell";
import { Truck, Wrench, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { EquipmentDetailModal } from "@/components/EquipmentDetailModal";
import { EquipmentMapView } from "@/components/EquipmentMapView";
import { Card } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";

interface Equipment {
  id: string;
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  siteId?: string | null;
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

export default function Dashboard() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const needsAttention: Equipment[] = [
    {
      id: "TR-2024-015",
      name: "Ford F-550",
      type: "Truck",
      location: "Unassigned",
      latitude: 40.7128,
      longitude: -74.0060, // New York
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
      id: "BH-2023-012",
      name: "CAT 420F Backhoe",
      type: "Backhoe",
      location: "Airport Expansion",
      latitude: 33.9416,
      longitude: -118.4085, // LAX area
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
      id: "LP-2023-042",
      name: "Graco LineDriver",
      type: "Line Painter",
      location: "Highway 401 Project",
      latitude: 41.8781,
      longitude: -87.6298, // Chicago
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
      id: "EX-2023-087",
      name: "Volvo EC220E",
      type: "Excavator",
      location: "Airport Expansion",
      latitude: 33.9416,
      longitude: -118.4085, // LAX area (same as backhoe)
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
  ];

  const handleRowClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Equipment overview and status</p>
      </div>

      <EquipmentMapView
        equipment={needsAttention}
        onEquipmentClick={(equipment) => {
          setSelectedEquipment(equipment);
          setDetailOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Equipment"
          value={47}
          icon={Truck}
        />
        <KPICard
          label="Maintenance Due"
          value={8}
          icon={Wrench}
        />
        <KPICard
          label="Active Sites"
          value={12}
          icon={MapPin}
        />
        <KPICard
          label="Engine Hours"
          value="3,245"
          icon={Clock}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Needs Attention</h2>
        <DataTable columns={columns} data={needsAttention} onRowClick={handleRowClick} />
      </Card>

      <EquipmentDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        equipment={selectedEquipment}
      />
    </div>
  );
}
