import { DataTable, SortableHeader } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { StatusCell, StatusCode } from "@/components/StatusCell";

interface Site {
  id: string;
  name: string;
  address: string;
  equipmentCount: number;
  activeEquipment: number;
  startDate: string;
  status: StatusCode;
}

export default function SitesPage() {
  const sites: Site[] = [
    {
      id: "SITE-001",
      name: "Downtown Build",
      address: "123 Main St, Toronto, ON",
      equipmentCount: 8,
      activeEquipment: 6,
      startDate: "Jan 10, 2025",
      status: "G_1",
    },
    {
      id: "SITE-002",
      name: "Highway 401 Project",
      address: "Highway 401, Mississauga, ON",
      equipmentCount: 12,
      activeEquipment: 10,
      startDate: "Feb 15, 2025",
      status: "Y_2",
    },
    {
      id: "SITE-003",
      name: "Airport Expansion",
      address: "Pearson Airport, Mississauga, ON",
      equipmentCount: 15,
      activeEquipment: 15,
      startDate: "Mar 1, 2025",
      status: "G_1",
    },
    {
      id: "SITE-004",
      name: "Residential Complex",
      address: "456 Oak Ave, Oakville, ON",
      equipmentCount: 5,
      activeEquipment: 3,
      startDate: "Apr 20, 2025",
      status: "G_1",
    },
    {
      id: "SITE-005",
      name: "Bridge Repair - QEW",
      address: "QEW Highway, Burlington, ON",
      equipmentCount: 7,
      activeEquipment: 7,
      startDate: "May 5, 2025",
      status: "G_1",
    },
  ];

  const columns: ColumnDef<Site>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Site Name</SortableHeader>,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs font-mono text-muted-foreground">{row.original.id}</div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => <SortableHeader column={column}>Address</SortableHeader>,
      cell: ({ row }) => <div className="text-sm">{row.original.address}</div>,
    },
    {
      accessorKey: "equipmentCount",
      header: ({ column }) => <SortableHeader column={column}>Equipment</SortableHeader>,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.activeEquipment} / {row.original.equipmentCount} active
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => <SortableHeader column={column}>Start Date</SortableHeader>,
      cell: ({ row }) => <div className="text-sm">{row.original.startDate}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
      cell: ({ row }) => <StatusCell status={row.original.status} type="maintenance" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Job Sites</h1>
          <p className="text-sm text-muted-foreground">{sites.length} active sites</p>
        </div>
        <Button data-testid="button-add-site">
          <Plus className="w-4 h-4 mr-2" />
          Add Site
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sites}
        onRowClick={(site) => console.log("View site:", site.id)}
      />
    </div>
  );
}
