# San Francisco CAD Incident Dashboard

An interactive web dashboard for exploring and analyzing San Francisco law enforcement dispatched calls for service (CAD records). Built with React, TypeScript, TanStack Query, Recharts, and Leaflet.

## 🚀 Features

### Data Visualization
- **Interactive Charts**: Multiple chart types including bar charts, pie charts, and line graphs showing:
  - Top 10 call types
  - Priority distribution
  - Incidents by hour of day
  - Incidents by day of week
  - Average response times by district
  - Daily incident trends (last 30 days)
  
- **Interactive Map**: Leaflet-based map showing incident locations with:
  - Color-coded markers by priority (A=Red, B=Orange, C=Green)
  - Interactive popups with incident details
  - Click-to-select incidents
  - Auto-zoom to fit all markers

- **Data Table**: Comprehensive table view with:
  - Sortable columns (date, call type, priority, district, response time)
  - Pagination (20 records per page)
  - Row selection with highlighting
  - Formatted dates and durations

### Filtering & Search
- **Multi-dimensional Filters**:
  - Search bar (searches call types, intersections, neighborhoods)
  - Date range picker
  - Priority filter (A, B, C)
  - Call type filter (checkbox list)
  - Police district filter
  - Agency filter
  - Clear all filters button

### Advanced Features
- **Linked Interactions**: Selecting incidents in the table highlights them on the map and vice versa
- **Real-time Metrics**: Calculated response times and call durations
- **Summary Statistics**: Total incidents, high priority count, average/median response times
- **Responsive Design**: Works on desktop and mobile devices
- **Data Caching**: TanStack Query for efficient data fetching and caching

## 📊 Data Processing

The dashboard automatically calculates:
- **Response Time**: \`onscene_datetime - received_datetime\`
- **Call Duration**: \`close_datetime - received_datetime\`
- **Temporal Analysis**: Hour of day, day of week, daily trends
- **Aggregate Metrics**: Averages, medians, counts by category

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite (Rolldown variant)
- **Data Fetching**: TanStack Query (React Query) v5
- **Charts**: Recharts
- **Maps**: React Leaflet + Leaflet
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## 📦 Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 🚀 Running the App

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open your browser to the URL shown (typically \`http://localhost:5173\`)

4. The app will automatically fetch the latest 2,000 incident records from the SF Open Data API

## 🏗️ Project Structure

\`\`\`
src/
├── components/
│   ├── Charts.tsx          # Analytics charts and summary stats
│   ├── DataTable.tsx       # Sortable, paginated table
│   ├── Filters.tsx         # Filter controls sidebar
│   └── IncidentMap.tsx     # Leaflet map with markers
├── hooks/
│   └── useIncidents.ts     # React Query hooks for data fetching
├── services/
│   └── api.ts              # API client for SF Open Data
├── types/
│   └── incident.ts         # TypeScript interfaces
├── utils/
│   └── dataProcessing.ts   # Data transformation utilities
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles with Tailwind
\`\`\`

## 🎯 Design Decisions

### Data Architecture
- **Client-side filtering**: All 2,000 records are fetched once and filtered in-memory for fast, responsive interactions
- **Processed data**: Incidents are enriched with calculated fields (response time, hour of day, etc.) on load
- **Memoization**: Heavy computations (unique values, chart data) are memoized with \`useMemo\` for performance

### UX Patterns
- **Progressive disclosure**: Data starts with overview (charts), then allows drilling into details (table)
- **Linked views**: Selections propagate between table and map for contextual exploration
- **Visual hierarchy**: Color-coded priorities (red/orange/green) provide at-a-glance understanding
- **Defensive design**: Graceful handling of missing data, loading states, and errors

### Component Design
- **Separation of concerns**: Each component has a single responsibility
- **Controlled components**: All state is managed in parent component for predictable data flow
- **TypeScript strict mode**: Full type safety with no \`any\` types
- **Responsive layout**: CSS Grid for flexible layouts, Tailwind for utility-first styling

### Performance Optimizations
- **TanStack Query**: 5-minute stale time prevents unnecessary refetches
- **Pagination**: Table only renders 20 rows at a time
- **Chart limits**: Top 10 items in most charts to avoid clutter
- **Map clustering**: Visual grouping through CircleMarkers (production apps would use MarkerCluster)

## 🔧 API Details

**Data Source**: [SF Open Data - Law Enforcement Dispatched Calls for Service](https://data.sfgov.org/Public-Safety/Law-Enforcement-Dispatched-Calls-for-Service-Real-/gnap-fj3t)

**Endpoint**: \`https://data.sfgov.org/resource/gnap-fj3t.json\`

**Fetch Strategy**: Fetches most recent 2,000 records sorted by \`received_datetime DESC\`

## 🤖 AI Usage

This dashboard was built with AI assistance (GitHub Copilot) which was used for:
- **Scaffolding**: Initial component structure and boilerplate
- **Data transformation**: Utility functions for date parsing, calculations, and aggregations
- **TypeScript types**: Interface definitions based on API schema
- **Chart configurations**: Recharts component setup and data formatting
- **Map integration**: Leaflet/React-Leaflet setup and coordinate handling
- **Documentation**: README structure and content

**Human oversight included**:
- Architecture decisions and component hierarchy
- UX design and interaction patterns
- Filter logic and state management
- Visual design and color schemes
- Testing and debugging

## 📝 Future Enhancements

Potential improvements for production use:
- **Real-time updates**: WebSocket connection or polling for live data
- **Advanced filtering**: Date range presets, custom time ranges, multi-select with AND/OR logic
- **Export functionality**: Download filtered data as CSV/JSON
- **Saved views**: Bookmark filter combinations
- **Map clustering**: MarkerClusterGroup for better performance with many markers
- **Heatmaps**: Temporal heatmaps showing call volume patterns
- **Comparison views**: Compare metrics across time periods or districts
- **Accessibility**: Full WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Performance**: Virtual scrolling for table, lazy loading for charts

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Data provided by the [City and County of San Francisco](https://datasf.org/)
- Icons and maps from [OpenStreetMap](https://www.openstreetmap.org/)
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and amazing open-source libraries