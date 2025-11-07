import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ERRForm } from "@/components/ERRForm";
import { InspectionForm } from "@/components/InspectionForm";

export default function FormsPage() {
  const [selectedFormType, setSelectedFormType] = useState<"err" | "inspection" | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Forms</h1>
        <p className="text-sm text-muted-foreground">Submit ERR or Inspection reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* ERR Form Card */}
        <Card className="p-6 hover-elevate cursor-pointer" onClick={() => setSelectedFormType("err")} data-testid="card-err-form">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-red-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Equipment Repair Request (ERR)</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Report equipment issues and request repairs. This will update the equipment and maintenance status.
              </p>
            </div>
            <Button className="w-full" data-testid="button-open-err-form">
              <FileText className="w-4 h-4 mr-2" />
              Submit ERR
            </Button>
          </div>
        </Card>

        {/* Inspection Form Card */}
        <Card className="p-6 hover-elevate cursor-pointer" onClick={() => setSelectedFormType("inspection")} data-testid="card-inspection-form">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Equipment Inspection</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Perform routine equipment inspections and document equipment condition.
              </p>
            </div>
            <Button className="w-full" data-testid="button-open-inspection-form">
              <FileText className="w-4 h-4 mr-2" />
              Submit Inspection
            </Button>
          </div>
        </Card>
      </div>

      {/* ERR Form Dialog */}
      <Dialog open={selectedFormType === "err"} onOpenChange={(open) => !open && setSelectedFormType(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Equipment Repair Request (ERR)</DialogTitle>
          </DialogHeader>
          <ERRForm onSuccess={() => setSelectedFormType(null)} />
        </DialogContent>
      </Dialog>

      {/* Inspection Form Dialog */}
      <Dialog open={selectedFormType === "inspection"} onOpenChange={(open) => !open && setSelectedFormType(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Equipment Inspection</DialogTitle>
          </DialogHeader>
          <InspectionForm onSuccess={() => setSelectedFormType(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
