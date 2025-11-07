import { cn } from "@/lib/utils";

export type StatusCode = "G_1" | "Y_2" | "R_3";

interface StatusCellProps {
  status: StatusCode;
  type: "maintenance" | "err";
}

export function StatusCell({ status, type }: StatusCellProps) {
  const colors = {
    G_1: "bg-green-100 text-green-800 border-green-300",
    Y_2: "bg-yellow-100 text-yellow-800 border-yellow-300",
    R_3: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="flex items-center justify-center">
      <span
        className={cn(
          "px-2 py-1 rounded text-xs font-mono font-semibold border",
          colors[status]
        )}
        data-testid={`status-${type}-${status}`}
      >
        {status}
      </span>
    </div>
  );
}
