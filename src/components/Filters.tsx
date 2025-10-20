import type { FilterOptions } from '../types/incident';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCallTypes: string[];
  availablePriorities: string[];
  availableDistricts: string[];
  availableAgencies: string[];
}

export function Filters({
  filters,
  onFiltersChange,
  availableCallTypes,
  availablePriorities,
  availableDistricts,
  availableAgencies,
}: FiltersProps) {
  const updateFilter = (key: keyof FilterOptions, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'callTypes' | 'priorities' | 'districts' | 'agencies', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      callTypes: [],
      priorities: [],
      districts: [],
      agencies: [],
      searchTerm: '',
      dateRange: { start: null, end: null },
      selectedIncidentIds: new Set(),
    });
  };

  const hasActiveFilters =
    filters.callTypes.length > 0 ||
    filters.priorities.length > 0 ||
    filters.districts.length > 0 ||
    filters.agencies.length > 0 ||
    filters.searchTerm ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search call type, intersection, or neighborhood..."
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              updateFilter('dateRange', {
                ...filters.dateRange,
                start: e.target.value ? new Date(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
            onChange={(e) =>
              updateFilter('dateRange', {
                ...filters.dateRange,
                end: e.target.value ? new Date(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority ({filters.priorities.length} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {availablePriorities.map((priority) => (
            <button
              key={priority}
              onClick={() => toggleArrayFilter('priorities', priority)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.priorities.includes(priority)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Call Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call Types ({filters.callTypes.length} selected)
        </label>
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
          {availableCallTypes.slice(0, 20).map((callType) => (
            <label key={callType} className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.callTypes.includes(callType)}
                onChange={() => toggleArrayFilter('callTypes', callType)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{callType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Districts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Police Districts ({filters.districts.length} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {availableDistricts.map((district) => (
            <button
              key={district}
              onClick={() => toggleArrayFilter('districts', district)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.districts.includes(district)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Agencies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agency ({filters.agencies.length} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {availableAgencies.map((agency) => (
            <button
              key={agency}
              onClick={() => toggleArrayFilter('agencies', agency)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.agencies.includes(agency)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {agency}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
