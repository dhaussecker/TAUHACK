import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge, EquipmentStatus } from "./StatusBadge";
import { MaintenanceTimeline } from "./MaintenanceTimeline";
import { QrCode, MapPin, User, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { QRCodeModal } from "./QRCodeModal";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  engineHours: number;
  lastSeen: string;
  operator?: string;
  site?: string;
  serialNumber: string;
  purchaseDate: string;
  nextMaintenance: string;
}

interface EquipmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
}

export function EquipmentDetailModal({ open, onOpenChange, equipment }: EquipmentDetailModalProps) {
  const [qrOpen, setQrOpen] = useState(false);

  if (!equipment) return null;

  const maintenanceEvents = [
    {
      id: "1",
      type: "scheduled" as const,
      title: "50-Hour Service",
      description: "Routine maintenance scheduled",
      date: equipment.nextMaintenance,
    },
    {
      id: "2",
      type: "completed" as const,
      title: "Oil Change",
      description: "Engine oil and filter replaced",
      date: "Oct 15, 2025",
      mechanic: "Mike Torres",
    },
    {
      id: "3",
      type: "completed" as const,
      title: "Hydraulic Inspection",
      description: "Full hydraulic system check completed",
      date: "Sep 28, 2025",
      mechanic: "Sarah Chen",
    },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto" data-testid="modal-equipment-detail">
          <SheetHeader className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="text-2xl">{equipment.name}</SheetTitle>
                <p className="text-sm font-mono text-muted-foreground mt-1">{equipment.id}</p>
              </div>
              <StatusBadge status={equipment.status} />
            </div>
          </SheetHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="maintenance" data-testid="tab-maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="usage" data-testid="tab-usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Type</p>
                  <p className="text-base font-medium">{equipment.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Serial Number</p>
                  <p className="text-base font-mono">{equipment.serialNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Engine Hours</p>
                  <p className="text-base font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {equipment.engineHours.toLocaleString()} hrs
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Purchase Date</p>
                  <p className="text-base font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {equipment.purchaseDate}
                  </p>
                </div>
                {equipment.site && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Site</p>
                    <p className="text-base font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {equipment.site}
                    </p>
                  </div>
                )}
                {equipment.operator && (
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Operator</p>
                    <p className="text-base font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {equipment.operator}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => setQrOpen(true)}
                  variant="outline"
                  className="w-full"
                  data-testid="button-show-qr"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="space-y-1 mb-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Next Maintenance</p>
                <p className="text-base font-medium">{equipment.nextMaintenance}</p>
              </div>
              <MaintenanceTimeline events={maintenanceEvents} />
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Last Seen</p>
                  <p className="text-base font-medium">{equipment.lastSeen}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Current State</p>
                  <p className="text-base font-medium">IDLE</p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Usage analytics and detailed tracking data will be displayed here.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <QRCodeModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        equipmentId={equipment.id}
        equipmentName={equipment.name}
      />
    </>
  );
}
