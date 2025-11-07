import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Truck, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function SitesPage() {
  const sites = [
    {
      id: "SITE-001",
      name: "Downtown Build",
      address: "123 Main St, Toronto, ON",
      equipmentCount: 8,
      activeEquipment: 6,
      startDate: "Jan 10, 2025",
      status: "good" as const,
    },
    {
      id: "SITE-002",
      name: "Highway 401 Project",
      address: "Highway 401, Mississauga, ON",
      equipmentCount: 12,
      activeEquipment: 10,
      startDate: "Feb 15, 2025",
      status: "warning" as const,
    },
    {
      id: "SITE-003",
      name: "Airport Expansion",
      address: "Pearson Airport, Mississauga, ON",
      equipmentCount: 15,
      activeEquipment: 15,
      startDate: "Mar 1, 2025",
      status: "good" as const,
    },
    {
      id: "SITE-004",
      name: "Residential Complex",
      address: "456 Oak Ave, Oakville, ON",
      equipmentCount: 5,
      activeEquipment: 3,
      startDate: "Apr 20, 2025",
      status: "good" as const,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((site) => (
          <Card
            key={site.id}
            className="p-6 hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => console.log("Site clicked:", site.id)}
            data-testid={`card-site-${site.id}`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground">{site.name}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{site.id}</p>
                </div>
                <StatusBadge status={site.status} />
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{site.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>{site.activeEquipment} of {site.equipmentCount} equipment active</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Started: {site.startDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("View equipment for:", site.id);
                  }}
                  data-testid={`button-view-equipment-${site.id}`}
                >
                  View Equipment
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
