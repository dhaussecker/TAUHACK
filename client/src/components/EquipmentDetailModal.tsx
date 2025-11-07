import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StatusCell, StatusCode } from "./StatusCell";
import { Badge } from "@/components/ui/badge";
import { QrCode, MapPin, User, Clock, Calendar, FileText, Shield, Truck } from "lucide-react";
import { useState } from "react";
import { QRCodeModal } from "./QRCodeModal";

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  notes: string;
  mechanic: string;
  requestedBy: string;
  status: "completed" | "scheduled" | "overdue";
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  maintenance: StatusCode;
  err: StatusCode;
  hours: number;
  serialNumber: string;
  purchaseDate: string;
  operator?: string;
  warrantyStatus: "Active" | "Expired" | "N/A";
  isRental: boolean;
  lastReportBy?: string;
  lastReportHours?: number;
  lastReportDate?: string;
  notes?: string;
}

interface EquipmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
}

export function EquipmentDetailModal({ open, onOpenChange, equipment }: EquipmentDetailModalProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const [notes, setNotes] = useState(equipment?.notes || "");

  if (!equipment) return null;

  const maintenanceHistory: MaintenanceRecord[] = [
    {
      id: "M-001",
      date: "Nov 8, 2025",
      type: "50-Hour Service",
      notes: "Scheduled routine maintenance",
      mechanic: "Mike Torres",
      requestedBy: "System Auto",
      status: "scheduled",
    },
    {
      id: "M-002",
      date: "Oct 15, 2025",
      type: "Oil Change & Filter",
      notes: "Replaced engine oil and filter. All systems normal.",
      mechanic: "Sarah Chen",
      requestedBy: "John Smith",
      status: "completed",
    },
    {
      id: "M-003",
      date: "Sep 28, 2025",
      type: "Hydraulic System Check",
      notes: "Full inspection completed. Minor leak repaired on line 3.",
      mechanic: "James Wilson",
      requestedBy: "Sarah Chen",
      status: "completed",
    },
  ];

  const handleSaveNotes = () => {
    console.log("Saving notes:", notes);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-3xl overflow-y-auto" data-testid="modal-equipment-detail">
          <SheetHeader className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <SheetTitle className="text-2xl">{equipment.name}</SheetTitle>
                <p className="text-sm font-mono text-muted-foreground mt-1">{equipment.id}</p>
                <div className="flex items-center gap-2 mt-3">
                  {equipment.isRental && (
                    <Badge variant="secondary" className="text-xs">
                      <Truck className="w-3 h-3 mr-1" />
                      RENTAL
                    </Badge>
                  )}
                  <Badge
                    variant={equipment.warrantyStatus === "Active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Warranty: {equipment.warrantyStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <StatusCell status={equipment.maintenance} type="maintenance" />
                <StatusCell status={equipment.err} type="err" />
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="maintenance" data-testid="tab-maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
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
                    {equipment.hours.toLocaleString()} hrs
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Purchase Date</p>
                  <p className="text-base font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {equipment.purchaseDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Location</p>
                  <p className="text-base font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {equipment.location}
                  </p>
                </div>
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

              {equipment.lastReportBy && (
                <Card className="p-4 bg-muted/50">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Last Report
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Reported By</p>
                      <p className="font-medium">{equipment.lastReportBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Recorded Hours</p>
                      <p className="font-medium font-mono">{equipment.lastReportHours?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="font-medium">{equipment.lastReportDate}</p>
                    </div>
                  </div>
                </Card>
              )}

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
              <div className="space-y-3">
                {maintenanceHistory.map((record) => (
                  <Card key={record.id} className="p-4" data-testid={`maintenance-record-${record.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{record.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{record.date}</p>
                        </div>
                        <Badge
                          variant={
                            record.status === "completed"
                              ? "default"
                              : record.status === "scheduled"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-muted-foreground">Notes: </span>
                          <span>{record.notes}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Mechanic: </span>
                            <span className="font-medium">{record.mechanic}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Requested By: </span>
                            <span className="font-medium">{record.requestedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Equipment Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this equipment..."
                  className="min-h-64"
                  data-testid="textarea-notes"
                />
                <Button onClick={handleSaveNotes} data-testid="button-save-notes">
                  Save Notes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Complete activity history will be displayed here including all maintenance,
                  repairs, location changes, and operator assignments.
                </p>
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
