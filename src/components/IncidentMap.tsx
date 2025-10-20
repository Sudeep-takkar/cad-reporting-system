import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ProcessedIncident } from '../types/incident';
import { parseCoordinates, formatDateTime } from '../utils/dataProcessing';

interface IncidentMapProps {
  data: ProcessedIncident[];
  selectedIds: Set<string>;
  onIncidentClick?: (id: string) => void;
}

function MapUpdater({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

export function IncidentMap({ data, selectedIds, onIncidentClick }: IncidentMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const incidentsWithCoords = useMemo(() => {
    return data
      .map((incident) => {
        const coords = parseCoordinates(incident.intersection_point);
        return coords ? { ...incident, coords } : null;
      })
      .filter((item): item is ProcessedIncident & { coords: [number, number] } => item !== null);
  }, [data]);

  const bounds = useMemo(() => {
    if (incidentsWithCoords.length === 0) return null;
    
    const latLngs = incidentsWithCoords.map(({ coords }) => L.latLng(coords[0], coords[1]));
    return L.latLngBounds(latLngs);
  }, [incidentsWithCoords]);

  const getMarkerColor = (incident: ProcessedIncident) => {
    if (selectedIds.has(incident.id)) return '#3B82F6'; // Blue for selected
    
    switch (incident.priority_final) {
      case 'A':
        return '#EF4444'; // Red
      case 'B':
        return '#F59E0B'; // Orange
      case 'C':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  const center: [number, number] = [37.7749, -122.4194]; // San Francisco

  if (incidentsWithCoords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Map</h3>
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
          <p className="text-gray-500">No incidents with location data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Incident Map ({incidentsWithCoords.length} locations)
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Priority A</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Priority B</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Priority C</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '500px', width: '100%' }}
        className="rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater bounds={bounds} />
        
        {incidentsWithCoords.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={incident.coords}
            radius={selectedIds.has(incident.id) ? 8 : 5}
            fillColor={getMarkerColor(incident)}
            color="#ffffff"
            weight={selectedIds.has(incident.id) ? 2 : 1}
            opacity={1}
            fillOpacity={0.7}
            eventHandlers={{
              click: () => {
                onIncidentClick?.(incident.id);
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold text-gray-900 mb-1">
                  {incident.call_type_final_desc || 'Unknown'}
                </div>
                <div className="text-gray-600 space-y-1">
                  <div>Priority: <span className="font-medium">{incident.priority_final || 'N/A'}</span></div>
                  <div>District: <span className="font-medium">{incident.police_district || 'N/A'}</span></div>
                  {incident.analysis_neighborhood && (
                    <div>Area: <span className="font-medium">{incident.analysis_neighborhood}</span></div>
                  )}
                  <div>Received: <span className="font-medium">{formatDateTime(incident.received_datetime)}</span></div>
                  {incident.responseTimeMinutes !== undefined && incident.responseTimeMinutes >= 0 && (
                    <div>Response: <span className="font-medium">{Math.round(incident.responseTimeMinutes)}m</span></div>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
