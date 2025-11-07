import { EquipmentCard } from "@/components/EquipmentCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";
import { EquipmentDetailModal } from "@/components/EquipmentDetailModal";

export default function EquipmentPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const allEquipment = [
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
      id: "EX-2023-087",
      name: "Volvo EC220E",
      type: "Excavator",
      status: "good" as const,
      engineHours: 2890,
      lastSeen: "5 hours ago",
      site: "Airport Expansion",
      serialNumber: "VLV220E2023087",
      purchaseDate: "Jun 5, 2023",
      nextMaintenance: "Nov 20, 2025",
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
    {
      id: "TR-2024-022",
      name: "RAM 3500",
      type: "Truck",
      status: "good" as const,
      engineHours: 1567,
      lastSeen: "1 hour ago",
      operator: "Mike Torres",
      site: "Residential Complex",
      serialNumber: "3C63R3HL2FG567890",
      purchaseDate: "Apr 8, 2024",
      nextMaintenance: "Dec 1, 2025",
    },
    {
      id: "SK-2023-031",
      name: "Bobcat T770",
      type: "Skid Steer",
      status: "offline" as const,
      engineHours: 4230,
      lastSeen: "3 days ago",
      serialNumber: "BBT770-2023031",
      purchaseDate: "May 12, 2023",
      nextMaintenance: "Nov 25, 2025",
    },
  ];

  const filteredEquipment = allEquipment.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) ||
                         eq.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || eq.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleEquipmentClick = (equipment: any) => {
    setSelectedEquipment(equipment);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Equipment</h1>
          <p className="text-sm text-muted-foreground">{filteredEquipment.length} total equipment</p>
        </div>
        <Button data-testid="button-add-equipment">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
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
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="warning">Maintenance Due</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((equipment) => (
          <EquipmentCard
            key={equipment.id}
            {...equipment}
            onClick={() => handleEquipmentClick(equipment)}
          />
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No equipment found</p>
        </div>
      )}

      <EquipmentDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        equipment={selectedEquipment}
      />
    </div>
  );
}
