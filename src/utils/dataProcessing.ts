import { parseISO, differenceInMinutes, format, getHours, getDay } from 'date-fns';
import type { CADIncident, ProcessedIncident } from '../types/incident';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function processIncident(incident: CADIncident): ProcessedIncident {
  const processed: ProcessedIncident = { ...incident };

  try {
    if (incident.received_datetime && incident.onscene_datetime) {
      const received = parseISO(incident.received_datetime);
      const onscene = parseISO(incident.onscene_datetime);
      processed.responseTimeMinutes = differenceInMinutes(onscene, received);
    }

    if (incident.received_datetime && incident.close_datetime) {
      const received = parseISO(incident.received_datetime);
      const closed = parseISO(incident.close_datetime);
      processed.callDurationMinutes = differenceInMinutes(closed, received);
    }

    if (incident.received_datetime) {
      const received = parseISO(incident.received_datetime);
      processed.hourOfDay = getHours(received);
      processed.dayOfWeek = DAYS_OF_WEEK[getDay(received)];
      processed.date = format(received, 'yyyy-MM-dd');
    }
  } catch (error) {
    console.error('Error processing incident:', incident.id, error);
  }

  return processed;
}

export function parseCoordinates(point?: { coordinates: [number, number] }): [number, number] | null {
  if (!point?.coordinates || point.coordinates.length !== 2) return null;
  const [lng, lat] = point.coordinates;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lat, lng];
}

export function formatDuration(minutes?: number): string {
  if (minutes === undefined || minutes < 0) return 'N/A';
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export function formatDateTime(datetime?: string): string {
  if (!datetime) return 'N/A';
  try {
    return format(parseISO(datetime), 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
}

export function getUniqueValues<T>(
  data: T[],
  key: keyof T
): string[] {
  const values = new Set<string>();
  data.forEach((item) => {
    const value = item[key];
    if (value && typeof value === 'string') {
      values.add(value);
    }
  });
  return Array.from(values).sort();
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}
