import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

interface HistoryEntry {
  id: string;
  date: string;
  time: string;
  type: "location" | "operator" | "maintenance" | "hours" | "status";
  description: string;
  user: string;
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

  // Sample data - would come from backend
  const maintenanceHistory: MaintenanceRecord[] = equipment.id === "EX-2024-001" ? [
    {
      id: "M-001",
      date: "Nov 15, 2025",
      type: "100-Hour Service",
      notes: "Scheduled routine maintenance due at 1300 hours",
      mechanic: "Mike Torres",
      requestedBy: "System Auto",
      status: "scheduled",
    },
    {
      id: "M-002",
      date: "Oct 15, 2025",
      type: "Oil Change & Filter",
      notes: "Replaced engine oil (15W-40) and oil filter. Checked all fluid levels. All systems normal.",
      mechanic: "Sarah Chen",
      requestedBy: "John Smith",
      status: "completed",
    },
    {
      id: "M-003",
      date: "Sep 28, 2025",
      type: "Hydraulic System Check",
      notes: "Full inspection completed. Minor leak repaired on hydraulic line 3. Replaced worn seal.",
      mechanic: "James Wilson",
      requestedBy: "Sarah Chen",
      status: "completed",
    },
  ] : [
    {
      id: "M-001",
      date: "Nov 8, 2025",
      type: "50-Hour Service",
      notes: "Scheduled routine maintenance",
      mechanic: "Mike Torres",
      requestedBy: "System Auto",
      status: "scheduled",
    },
  ];

  const historyEntries: HistoryEntry[] = equipment.id === "EX-2024-001" ? [
    {
      id: "H-001",
      date: "Nov 7, 2025",
      time: "2:15 PM",
      type: "hours",
      description: "Engine hours updated: 1245 hrs",
      user: "John Smith",
    },
    {
      id: "H-002",
      date: "Nov 6, 2025",
      time: "8:30 AM",
      description: "Moved to Downtown Build site",
      type: "location",
      user: "Mike Torres",
    },
    {
      id: "H-003",
      date: "Nov 5, 2025",
      time: "4:45 PM",
      type: "operator",
      description: "Operator assigned: John Smith",
      user: "Admin",
    },
    {
      id: "H-004",
      date: "Oct 15, 2025",
      time: "11:20 AM",
      type: "maintenance",
      description: "Oil change completed",
      user: "Sarah Chen",
    },
    {
      id: "H-005",
      date: "Oct 14, 2025",
      time: "3:00 PM",
      type: "status",
      description: "Maintenance status changed to G_1",
      user: "Sarah Chen",
    },
    {
      id: "H-006",
      date: "Oct 1, 2025",
      time: "9:15 AM",
      type: "location",
      description: "Moved to Airport Expansion site",
      user: "Mike Torres",
    },
    {
      id: "H-007",
      date: "Sep 28, 2025",
      time: "2:30 PM",
      type: "maintenance",
      description: "Hydraulic system check completed",
      user: "James Wilson",
    },
  ] : [
    {
      id: "H-001",
      date: equipment.lastReportDate || "Nov 7, 2025",
      time: "2:00 PM",
      type: "hours",
      description: `Engine hours updated: ${equipment.hours} hrs`,
      user: equipment.lastReportBy || "Unknown",
    },
  ];

  const handleSaveNotes = () => {
    console.log("Saving notes:", notes);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-3xl overflow-y-auto" data-testid="modal-equipment-detail">
          <SheetHeader className="mb-6 sticky top-0 bg-background z-20 pb-4 border-b">
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

            <div className="flex gap-2 mt-4 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection("overview")}
                data-testid="nav-overview"
              >
                Overview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection("maintenance")}
                data-testid="nav-maintenance"
              >
                Maintenance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection("notes")}
                data-testid="nav-notes"
              >
                Notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection("history")}
                data-testid="nav-history"
              >
                History
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-8">
            <section id="overview" className="scroll-mt-32">
              <h3 className="text-lg font-semibold mb-4">Overview</h3>
              <div className="space-y-6">
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
            </section>

            <section id="maintenance" className="scroll-mt-32">
              <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
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
            </section>

            <section id="notes" className="scroll-mt-32">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              <div className="space-y-3">
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
            </section>

            <section id="history" className="scroll-mt-32">
              <h3 className="text-lg font-semibold mb-4">Activity History</h3>
              <div className="space-y-2">
                {historyEntries.map((entry) => (
                  <Card key={entry.id} className="p-3" data-testid={`history-${entry.id}`}>
                    <div className="flex items-start gap-3">
                      <div className="text-xs text-muted-foreground min-w-24">
                        <div>{entry.date}</div>
                        <div>{entry.time}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{entry.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {entry.user}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
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
