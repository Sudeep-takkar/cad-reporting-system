import type { CADIncident } from '../types/incident';

const API_BASE_URL = 'https://data.sfgov.org/resource/gnap-fj3t.json';
const DEFAULT_LIMIT = 10; // Fetch last 10 records

export async function fetchIncidents(limit = DEFAULT_LIMIT): Promise<CADIncident[]> {
  try {
    const url = `${API_BASE_URL}?$limit=${limit}&$order=received_datetime DESC`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as CADIncident[];
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
}

export async function fetchIncidentsByDateRange(
  startDate: Date,
  endDate: Date,
  limit = DEFAULT_LIMIT
): Promise<CADIncident[]> {
  try {
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    
    const url = `${API_BASE_URL}?$where=received_datetime between '${startISO}' and '${endISO}'&$limit=${limit}&$order=received_datetime DESC`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as CADIncident[];
  } catch (error) {
    console.error('Error fetching incidents by date range:', error);
    throw error;
  }
}
