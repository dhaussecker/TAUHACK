import { EquipmentCard } from "../EquipmentCard";

export default function EquipmentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <EquipmentCard
        id="EX-2024-001"
        name="CAT 320 Excavator"
        type="Excavator"
        status="good"
        engineHours={1245}
        lastSeen="2 hours ago"
        operator="John Smith"
        site="Downtown Build"
        onClick={() => console.log("Equipment clicked")}
      />
      <EquipmentCard
        id="LP-2023-042"
        name="Graco LineDriver"
        type="Line Painter"
        status="warning"
        engineHours={3890}
        lastSeen="1 day ago"
        site="Highway 401 Project"
        onClick={() => console.log("Equipment clicked")}
      />
      <EquipmentCard
        id="TR-2024-015"
        name="Ford F-550"
        type="Truck"
        status="critical"
        engineHours={5420}
        lastSeen="3 hours ago"
        operator="Sarah Johnson"
        onClick={() => console.log("Equipment clicked")}
      />
    </div>
  );
}
