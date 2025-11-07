import { Card } from "@/components/ui/card";
import { StatusBadge, EquipmentStatus } from "./StatusBadge";
import { Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  engineHours: number;
  lastSeen: string;
  operator?: string;
  site?: string;
  onClick?: () => void;
  className?: string;
}

export function EquipmentCard({
  id,
  name,
  type,
  status,
  engineHours,
  lastSeen,
  operator,
  site,
  onClick,
  className
}: EquipmentCardProps) {
  const statusColors = {
    good: "border-l-green-500",
    warning: "border-l-yellow-500",
    critical: "border-l-red-500",
    offline: "border-l-gray-400",
  };

  return (
    <Card
      className={cn(
        "p-5 border-l-4 cursor-pointer hover-elevate active-elevate-2",
        statusColors[status],
        className
      )}
      onClick={onClick}
      data-testid={`card-equipment-${id}`}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium text-foreground">{name}</h3>
          <p className="text-sm font-mono text-muted-foreground">{id}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{type}</span>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{engineHours.toLocaleString()} hrs</span>
          </div>
          
          {site && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{site}</span>
            </div>
          )}
          
          {operator && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{operator}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last seen: {lastSeen}
        </div>
      </div>
    </Card>
  );
}
