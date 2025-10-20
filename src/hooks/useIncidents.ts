import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '../services/api';
import { processIncident } from '../utils/dataProcessing';
import type { ProcessedIncident } from '../types/incident';

export function useIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: () => fetchIncidents(),
    select: (data) => data.map(processIncident),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useFilteredIncidents(
  incidents: ProcessedIncident[] | undefined,
  filters: {
    callTypes: string[];
    priorities: string[];
    districts: string[];
    agencies: string[];
    searchTerm: string;
    dateRange: { start: Date | null; end: Date | null };
  }
) {
  if (!incidents) return [];

  return incidents.filter((incident) => {
    if (filters.callTypes.length > 0) {
      if (!incident.call_type_final_desc || !filters.callTypes.includes(incident.call_type_final_desc)) {
        return false;
      }
    }

    if (filters.priorities.length > 0) {
      if (!incident.priority_final || !filters.priorities.includes(incident.priority_final)) {
        return false;
      }
    }

    if (filters.districts.length > 0) {
      if (!incident.police_district || !filters.districts.includes(incident.police_district)) {
        return false;
      }
    }

    if (filters.agencies.length > 0) {
      if (!incident.agency || !filters.agencies.includes(incident.agency)) {
        return false;
      }
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesCallType = incident.call_type_final_desc?.toLowerCase().includes(searchLower);
      const matchesIntersection = incident.intersection_name?.toLowerCase().includes(searchLower);
      const matchesNeighborhood = incident.analysis_neighborhood?.toLowerCase().includes(searchLower);
      
      if (!matchesCallType && !matchesIntersection && !matchesNeighborhood) {
        return false;
      }
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      if (!incident.received_datetime) return false;
      
      const incidentDate = new Date(incident.received_datetime);
      
      if (filters.dateRange.start && incidentDate < filters.dateRange.start) {
        return false;
      }
      
      if (filters.dateRange.end) {
        const endOfDay = new Date(filters.dateRange.end);
        endOfDay.setHours(23, 59, 59, 999);
        if (incidentDate > endOfDay) {
          return false;
        }
      }
    }

    return true;
  });
}
