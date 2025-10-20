import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIncidents, useFilteredIncidents } from './hooks/useIncidents';
import { Filters } from './components/Filters';
import { DataTable } from './components/DataTable';
import { Charts } from './components/Charts';
import { IncidentMap } from './components/IncidentMap';
import { getUniqueValues } from './utils/dataProcessing';
import type { FilterOptions, TabType } from './types/incident';

const queryClient = new QueryClient();

function DashboardContent() {
  const { data: incidents, isLoading, error } = useIncidents();
  
  const [filters, setFilters] = useState<FilterOptions>({
    callTypes: [],
    priorities: [],
    districts: [],
    agencies: [],
    searchTerm: '',
    dateRange: { start: null, end: null },
    selectedIncidentIds: new Set<string>(),
  });

  const [activeTab, setActiveTab] = useState<TabType>('charts');

  const filteredData = useFilteredIncidents(incidents, filters);

  const availableCallTypes = useMemo(
    () => (incidents ? getUniqueValues(incidents, 'call_type_final_desc') : []),
    [incidents]
  );

  const availablePriorities = useMemo(
    () => (incidents ? getUniqueValues(incidents, 'priority_final') : []),
    [incidents]
  );

  const availableDistricts = useMemo(
    () => (incidents ? getUniqueValues(incidents, 'police_district') : []),
    [incidents]
  );

  const availableAgencies = useMemo(
    () => (incidents ? getUniqueValues(incidents, 'agency') : []),
    [incidents]
  );

  const handleSelectionChange = (ids: Set<string>) => {
    setFilters((prev) => ({ ...prev, selectedIncidentIds: ids }));
  };

  const handleIncidentClick = (id: string) => {
    const newSelection = new Set(filters.selectedIncidentIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setFilters((prev) => ({ ...prev, selectedIncidentIds: newSelection }));
  };

  if (isLoading) {
    // Incidents are being fetched
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading incident data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'Failed to load incident data. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            San Francisco CAD Incident Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time law enforcement dispatched calls for service
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              availableCallTypes={availableCallTypes}
              availablePriorities={availablePriorities}
              availableDistricts={availableDistricts}
              availableAgencies={availableAgencies}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('charts')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'charts'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📊 Charts & Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'map'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🗺️ Map View
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'charts' && <Charts data={filteredData} />}
                {activeTab === 'map' && (
                  <IncidentMap
                    data={filteredData}
                    selectedIds={filters.selectedIncidentIds}
                    onIncidentClick={handleIncidentClick}
                  />
                )}
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              data={filteredData}
              selectedIds={filters.selectedIncidentIds}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Data source:{' '}
            <a
              href="https://data.sfgov.org/Public-Safety/Law-Enforcement-Dispatched-Calls-for-Service-Real-/gnap-fj3t"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              SF Open Data Portal
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}

export default App;
