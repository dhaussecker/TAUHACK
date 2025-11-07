import { MaintenanceTimeline } from "../MaintenanceTimeline";

export default function MaintenanceTimelineExample() {
  const events = [
    {
      id: "1",
      type: "overdue" as const,
      title: "Oil Change - OVERDUE",
      description: "Engine oil and filter replacement needed immediately",
      date: "Nov 5, 2025",
    },
    {
      id: "2",
      type: "scheduled" as const,
      title: "50-Hour Inspection",
      description: "Routine inspection and lubrication",
      date: "Nov 10, 2025",
      mechanic: "Mike Torres",
    },
    {
      id: "3",
      type: "completed" as const,
      title: "Hydraulic System Check",
      description: "Inspected hydraulic lines and replaced worn seals",
      date: "Nov 1, 2025",
      mechanic: "Sarah Chen",
    },
  ];

  return <MaintenanceTimeline events={events} />;
}
