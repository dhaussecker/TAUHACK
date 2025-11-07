import { QRCodeModal } from "../QRCodeModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function QRCodeModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Show QR Code</Button>
      <QRCodeModal
        open={open}
        onOpenChange={setOpen}
        equipmentId="EX-2024-001"
        equipmentName="CAT 320 Excavator"
      />
    </div>
  );
}
