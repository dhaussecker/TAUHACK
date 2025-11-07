import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EquipmentStatus = "good" | "warning" | "critical" | "offline";

interface StatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    good: "bg-green-500 text-white border-green-600",
    warning: "bg-yellow-500 text-black border-yellow-600",
    critical: "bg-red-500 text-white border-red-600",
    offline: "bg-gray-400 text-white border-gray-500",
  };

  const labels = {
    good: "GOOD",
    warning: "MAINTENANCE DUE",
    critical: "CRITICAL",
    offline: "OFFLINE",
  };

  return (
    <Badge
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase border",
        variants[status],
        className
      )}
      data-testid={`badge-status-${status}`}
    >
      {labels[status]}
    </Badge>
  );
}
