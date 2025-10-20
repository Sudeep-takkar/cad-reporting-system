export interface IntersectionPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface CADIncident {
  id: string;
  cad_number: string;
  received_datetime: string;
  entry_datetime?: string;
  dispatch_datetime?: string;
  enroute_datetime?: string;
  onscene_datetime?: string;
  close_datetime?: string;
  call_type_original?: string;
  call_type_original_desc?: string;
  call_type_final?: string;
  call_type_final_desc?: string;
  priority_original?: string;
  priority_final?: string;
  agency?: string;
  disposition?: string;
  onview_flag?: string;
  sensitive_call?: boolean;
  intersection_name?: string;
  intersection_id?: string;
  intersection_point?: IntersectionPoint;
  supervisor_district?: string;
  analysis_neighborhood?: string;
  police_district?: string;
  call_last_updated_at?: string;
  data_as_of?: string;
  data_loaded_at?: string;
}

export interface ProcessedIncident extends CADIncident {
  responseTimeMinutes?: number;
  callDurationMinutes?: number;
  hourOfDay?: number;
  dayOfWeek?: string;
  date?: string;
}

export interface FilterOptions {
  callTypes: string[];
  priorities: string[];
  districts: string[];
  agencies: string[];
  searchTerm: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  selectedIncidentIds: Set<string>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export type TabType = 'charts' | 'map';