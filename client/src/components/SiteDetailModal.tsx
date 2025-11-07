import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusCell, StatusCode } from "./StatusCell";
import { MapPin, Calendar, Truck, Users, FileText } from "lucide-react";

interface Site {
  id: string;
  name: string;
  address: string;
  equipmentCount: number;
  activeEquipment: number;
  startDate: string;
  status: StatusCode;
}

interface SiteDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: Site | null;
}

export function SiteDetailModal({ open, onOpenChange, site }: SiteDetailModalProps) {
  if (!site) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl mb-2">{site.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">Site ID: {site.id}</p>
            </div>
            <StatusCell status={site.status} type="maintenance" />
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Overview Section */}
          <section id="overview">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Overview
            </h3>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">{site.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{site.startDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Equipment</p>
                    <p className="text-sm font-medium">
                      {site.activeEquipment} / {site.equipmentCount} active
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Project Manager</p>
                    <p className="text-sm font-medium">Unassigned</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Equipment List Section */}
          <section id="equipment">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Equipment On Site
            </h3>
            <Card className="p-4">
              <div className="space-y-2">
                {site.activeEquipment > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {site.activeEquipment} piece{site.activeEquipment !== 1 ? 's' : ''} of equipment currently active
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-muted-foreground text-sm">
                    <Truck className="w-4 h-4 mt-0.5" />
                    <p>No equipment assigned to this site yet</p>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Notes Section */}
          <section id="notes">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Site Notes
            </h3>
            <Card className="p-4">
              <div className="flex items-start gap-2 text-muted-foreground text-sm">
                <FileText className="w-4 h-4 mt-0.5" />
                <p>No notes added yet</p>
              </div>
            </Card>
          </section>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="default" className="flex-1" data-testid="button-edit-site">
              <FileText className="w-4 h-4 mr-2" />
              Edit Site
            </Button>
            <Button variant="outline" className="flex-1" data-testid="button-view-equipment">
              <Truck className="w-4 h-4 mr-2" />
              View Equipment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
