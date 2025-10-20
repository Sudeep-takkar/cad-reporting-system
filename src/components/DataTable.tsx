import { useState, useMemo } from 'react';
import type { ProcessedIncident } from '../types/incident';
import { formatDateTime, formatDuration } from '../utils/dataProcessing';

interface DataTableProps {
  data: ProcessedIncident[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

type SortField = 'received_datetime' | 'call_type_final_desc' | 'priority_final' | 'responseTimeMinutes' | 'police_district' | 'agency';
type SortDirection = 'asc' | 'desc';

export function DataTable({ data, selectedIds, onSelectionChange }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('received_datetime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 20;
  console.log(data)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: string | number | undefined = a[sortField];
      let bValue: string | number | undefined = b[sortField];

      // Handle undefined values
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Convert to comparable values
      if (sortField === 'received_datetime') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  const toggleAllOnPage = () => {
    const newSelection = new Set(selectedIds);
    const allSelected = paginatedData.every((incident) => selectedIds.has(incident.id));

    paginatedData.forEach((incident) => {
      if (allSelected) {
        newSelection.delete(incident.id);
      } else {
        newSelection.add(incident.id);
      }
    });

    onSelectionChange(newSelection);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">⇅</span>;
    }
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'A':
        return 'bg-red-100 text-red-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Incidents Table ({data.length} records)
        </h2>
        {selectedIds.size > 0 && (
          <p className="text-sm text-gray-600 mt-1">{selectedIds.size} selected</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={paginatedData.length > 0 && paginatedData.every((i) => selectedIds.has(i.id))}
                  onChange={toggleAllOnPage}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                onClick={() => handleSort('received_datetime')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Received</span>
                  <SortIcon field="received_datetime" />
                </div>
              </th>
              <th
                onClick={() => handleSort('call_type_final_desc')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Call Type</span>
                  <SortIcon field="call_type_final_desc" />
                </div>
              </th>
              <th
                onClick={() => handleSort('priority_final')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  <SortIcon field="priority_final" />
                </div>
              </th>
              <th
                onClick={() => handleSort('police_district')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>District</span>
                  <SortIcon field="police_district" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Neighborhood
              </th>
              <th
                onClick={() => handleSort('responseTimeMinutes')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Response Time</span>
                  <SortIcon field="responseTimeMinutes" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th
                onClick={() => handleSort('agency')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Agency</span>
                  <SortIcon field="agency" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cad Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Call Last Updated At
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((incident) => (
              <tr
                key={incident.id}
                className={`hover:bg-gray-50 ${selectedIds.has(incident.id) ? 'bg-blue-50' : ''
                  }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(incident.id)}
                    onChange={() => toggleSelection(incident.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(incident.received_datetime)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {incident.call_type_final_desc || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      incident.priority_final
                    )}`}
                  >
                    {incident.priority_final || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {incident.police_district || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {incident.analysis_neighborhood || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(incident.responseTimeMinutes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(incident.callDurationMinutes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {incident.agency || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {incident.cad_number || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(incident.call_last_updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of{' '}
          {sortedData.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
