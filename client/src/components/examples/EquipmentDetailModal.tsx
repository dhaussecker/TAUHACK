import { EquipmentDetailModal } from "../EquipmentDetailModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EquipmentDetailModalExample() {
  const [open, setOpen] = useState(false);

  const equipment = {
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
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show Equipment Details</Button>
      <EquipmentDetailModal
        open={open}
        onOpenChange={setOpen}
        equipment={equipment}
      />
    </div>
  );
}
