import { KPICard } from "../KPICard";
import { Truck, Wrench, MapPin, Clock } from "lucide-react";

export default function KPICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Total Equipment"
        value={47}
        icon={Truck}
        trend={{ value: "3 this month", isPositive: true }}
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
        trend={{ value: "245 this week", isPositive: true }}
      />
    </div>
  );
}
