import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("usage");
  const [timeRange, setTimeRange] = useState("month");

  const reports = [
    {
      id: "RPT-001",
      name: "Equipment Usage Report",
      type: "Usage",
      date: "Nov 1 - Nov 7, 2025",
      description: "Weekly equipment utilization and hours tracked",
    },
    {
      id: "RPT-002",
      name: "Maintenance Summary",
      type: "Maintenance",
      date: "October 2025",
      description: "All maintenance activities and costs for the month",
    },
    {
      id: "RPT-003",
      name: "Site Equipment Allocation",
      type: "Sites",
      date: "Nov 7, 2025",
      description: "Current equipment distribution across all active sites",
    },
    {
      id: "RPT-004",
      name: "Asset Utilization Analysis",
      type: "Analytics",
      date: "Q3 2025",
      description: "Quarterly analysis of owned vs rental equipment efficiency",
    },
  ];

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download equipment reports</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger data-testid="select-report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage">Equipment Usage</SelectItem>
                <SelectItem value="maintenance">Maintenance Summary</SelectItem>
                <SelectItem value="utilization">Asset Utilization</SelectItem>
                <SelectItem value="sites">Site Allocation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger data-testid="select-time-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full" data-testid="button-generate-report">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("pdf")}
            data-testid="button-export-pdf"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
        <div className="grid grid-cols-1 gap-3">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="p-4 hover-elevate cursor-pointer"
              onClick={() => console.log("View report:", report.id)}
              data-testid={`card-report-${report.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-medium text-foreground">{report.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{report.date}</span>
                    <span className="ml-2">•</span>
                    <span>{report.type}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Download:", report.id);
                  }}
                  data-testid={`button-download-${report.id}`}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
