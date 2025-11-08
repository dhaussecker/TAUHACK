import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { MapPin, Map, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

// Fix for default marker icons in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Equipment {
  id: string;
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  maintenance: string;
  err: string;
  hours: number;
  type: string;
  siteId?: string | null;
}

interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface EquipmentMapViewProps {
  equipment: Equipment[];
  sites?: Site[];
}

type ViewMode = "street" | "satellite";

// Helper to create custom markers based on status
const createStatusMarker = (status: string, type: "maintenance" | "err") => {
  const colors = {
    G_1: "#22c55e", // green-500
    Y_2: "#eab308", // yellow-500
    R_3: "#ef4444", // red-500
  };

  const color = colors[status as keyof typeof colors] || "#6b7280"; // gray-500 as default

  const svgIcon = `
    <svg width="32" height="42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C9.4 0 4 5.4 4 12c0 8 12 30 12 30s12-22 12-30c0-6.6-5.4-12-12-12z"
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="12" r="6" fill="#fff"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Component to auto-fit map bounds
function MapBounds({ equipment, sites }: { equipment: Equipment[]; sites?: Site[] }) {
  const map = useMap();

  useEffect(() => {
    const bounds: L.LatLngTuple[] = [];

    // Add equipment coordinates
    equipment.forEach((eq) => {
      if (eq.latitude && eq.longitude) {
        bounds.push([eq.latitude, eq.longitude]);
      }
    });

    // Add site coordinates
    sites?.forEach((site) => {
      if (site.latitude && site.longitude) {
        bounds.push([site.latitude, site.longitude]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [equipment, sites, map]);

  return null;
}

export function EquipmentMapView({ equipment, sites = [] }: EquipmentMapViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("street");
  const [, setLocation] = useLocation();

  // Filter equipment with valid coordinates or that can inherit from site
  const mappableEquipment = equipment.filter((eq) => {
    if (eq.latitude && eq.longitude) return true;
    if (eq.siteId) {
      const site = sites.find((s) => s.id === eq.siteId);
      return site && site.latitude && site.longitude;
    }
    return false;
  });

  // Get coordinates for equipment (own coords or site coords)
  const getEquipmentCoords = (eq: Equipment): [number, number] | null => {
    if (eq.latitude && eq.longitude) {
      return [eq.latitude, eq.longitude];
    }
    if (eq.siteId) {
      const site = sites.find((s) => s.id === eq.siteId);
      if (site && site.latitude && site.longitude) {
        return [site.latitude, site.longitude];
      }
    }
    return null;
  };

  // Navigate to equipment page with ID parameter
  const handleViewDetails = (equipmentId: string) => {
    setLocation(`/equipment?id=${equipmentId}`);
  };

  // Default center (will be overridden by MapBounds)
  const defaultCenter: L.LatLngTuple = [39.8283, -98.5795]; // Center of USA

  return (
    <Card className="overflow-hidden">
      {/* Map header with view toggle */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <h3 className="text-sm font-medium">Equipment Locations</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "street" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("street")}
            className="h-8"
          >
            <Map className="w-4 h-4 mr-1" />
            Street
          </Button>
          <Button
            variant={viewMode === "satellite" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("satellite")}
            className="h-8"
          >
            <Satellite className="w-4 h-4 mr-1" />
            Satellite
          </Button>
        </div>
      </div>

      <div className="h-[450px] relative">
        {mappableEquipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full bg-muted/10">
            <MapPin className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No equipment locations available</p>
            <p className="text-sm text-muted-foreground">Add coordinates to equipment or sites to see them on the map</p>
          </div>
        ) : (
          <MapContainer
            center={defaultCenter}
            zoom={4}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {viewMode === "street" ? (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            ) : (
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}

            <MapBounds equipment={mappableEquipment} sites={sites} />

            {/* Render site markers */}
            {sites
              .filter((site) => site.latitude && site.longitude)
              .map((site) => {
                const equipmentAtSite = mappableEquipment.filter((eq) => eq.siteId === site.id);
                return (
                  <Marker
                    key={`site-${site.id}`}
                    position={[site.latitude!, site.longitude!]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-sm mb-1">{site.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {site.address}, {site.city}
                          {site.state && `, ${site.state}`}
                        </p>
                        {equipmentAtSite.length > 0 && (
                          <p className="text-xs font-medium">
                            {equipmentAtSite.length} equipment unit{equipmentAtSite.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Render equipment markers */}
            {mappableEquipment.map((eq) => {
              const coords = getEquipmentCoords(eq);
              if (!coords) return null;

              // Determine the worst status for marker color
              const worstStatus = eq.maintenance === "R_3" || eq.err === "R_3"
                ? "R_3"
                : eq.maintenance === "Y_2" || eq.err === "Y_2"
                ? "Y_2"
                : "G_1";

              return (
                <Marker
                  key={eq.id}
                  position={coords}
                  icon={createStatusMarker(worstStatus, "maintenance")}
                >
                  <Popup>
                    <div className="p-2 min-w-[180px]">
                      <h3 className="font-semibold text-sm mb-2">{eq.name}</h3>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Maintenance:</span>
                          <StatusBadge status={eq.maintenance} type="maintenance" />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">ERR:</span>
                          <StatusBadge status={eq.err} type="err" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(eq.id)}
                        className="mt-2 text-xs text-primary hover:underline w-full text-left font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </Card>
  );
}
