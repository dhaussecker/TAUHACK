import { KPICard } from "@/components/KPICard";
import { EquipmentCard } from "@/components/EquipmentCard";
import { Truck, Wrench, MapPin, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { EquipmentDetailModal } from "@/components/EquipmentDetailModal";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const recentEquipment = [
    {
      id: "EX-2024-001",
      name: "CAT 320 Excavator",
      type: "Excavator",
      status: "good" as const,
      engineHours: 1245,
      lastSeen: "2 hours ago",
      operator: "John Smith",
      site: "Downtown Build",
      serialNumber: "CAT320GC2024001",
      purchaseDate: "Jan 15, 2024",
      nextMaintenance: "Nov 15, 2025",
    },
    {
      id: "LP-2023-042",
      name: "Graco LineDriver",
      type: "Line Painter",
      status: "warning" as const,
      engineHours: 3890,
      lastSeen: "1 day ago",
      site: "Highway 401 Project",
      serialNumber: "GLD2023042",
      purchaseDate: "Mar 22, 2023",
      nextMaintenance: "Nov 8, 2025",
    },
    {
      id: "TR-2024-015",
      name: "Ford F-550",
      type: "Truck",
      status: "critical" as const,
      engineHours: 5420,
      lastSeen: "3 hours ago",
      operator: "Sarah Johnson",
      serialNumber: "1FDUF5HT8FDA12345",
      purchaseDate: "Feb 10, 2024",
      nextMaintenance: "OVERDUE",
    },
  ];

  const handleEquipmentClick = (equipment: any) => {
    setSelectedEquipment(equipment);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Equipment overview and status</p>
      </div>

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
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold">Needs Attention</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentEquipment.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              {...equipment}
              onClick={() => handleEquipmentClick(equipment)}
            />
          ))}
        </div>
      </Card>

      <EquipmentDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        equipment={selectedEquipment}
      />
    </div>
  );
}
