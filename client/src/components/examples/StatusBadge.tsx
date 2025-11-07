import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-3 flex-wrap">
      <StatusBadge status="good" />
      <StatusBadge status="warning" />
      <StatusBadge status="critical" />
      <StatusBadge status="offline" />
    </div>
  );
}
