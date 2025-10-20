# San Francisco CAD Incident Dashboard# San Francisco CAD Incident Dashboard



An interactive web dashboard for exploring and analyzing San Francisco law enforcement dispatched calls for service (CAD records). Built with React, TypeScript, TanStack Query, Recharts, and Leaflet.An interactive web dashboard for exploring and analyzing San Francisco law enforcement dispatched calls for service (CAD records). Built with React, TypeScript, TanStack Query, Recharts, and Leaflet.



## 🚀 Features## 🚀 Features



### Data Visualization### Data Visualization

- **Interactive Charts**: Multiple chart types including bar charts, pie charts, and line graphs showing:- **Interactive Charts**: Multiple chart types including bar charts, pie charts, and line graphs showing:

  - Top 10 call types  - Top 10 call types

  - Priority distribution  - Priority distribution

  - Incidents by hour of day  - Incidents by hour of day

  - Incidents by day of week  - Incidents by day of week

  - Average response times by district  - Average response times by district

  - Daily incident trends (last 30 days)  - Daily incident trends (last 30 days)

    

- **Interactive Map**: Leaflet-based map showing incident locations with:- **Interactive Map**: Leaflet-based map showing incident locations with:

  - Color-coded markers by priority (A=Red, B=Orange, C=Green)  - Color-coded markers by priority (A=Red, B=Orange, C=Green)

  - Interactive popups with incident details  - Interactive popups with incident details

  - Click-to-select incidents  - Click-to-select incidents

  - Auto-zoom to fit all markers  - Auto-zoom to fit all markers



- **Data Table**: Comprehensive table view with:- **Data Table**: Comprehensive table view with:

  - Sortable columns (date, call type, priority, district, response time)  - Sortable columns (date, call type, priority, district, response time)

  - Pagination (20 records per page)  - Pagination (20 records per page)

  - Row selection with highlighting  - Row selection with highlighting

  - Formatted dates and durations  - Formatted dates and durations



### Filtering & Search### Filtering & Search

- **Multi-dimensional Filters**:- **Multi-dimensional Filters**:

  - Search bar (searches call types, intersections, neighborhoods)  - Search bar (searches call types, intersections, neighborhoods)

  - Date range picker  - Date range picker

  - Priority filter (A, B, C)  - Priority filter (A, B, C)

  - Call type filter (checkbox list)  - Call type filter (checkbox list)

  - Police district filter  - Police district filter

  - Agency filter  - Agency filter

  - Clear all filters button  - Clear all filters button



### Advanced Features### Advanced Features

- **Linked Interactions**: Selecting incidents in the table highlights them on the map and vice versa- **Linked Interactions**: Selecting incidents in the table highlights them on the map and vice versa

- **Real-time Metrics**: Calculated response times and call durations- **Real-time Metrics**: Calculated response times and call durations

- **Summary Statistics**: Total incidents, high priority count, average/median response times- **Summary Statistics**: Total incidents, high priority count, average/median response times

- **Responsive Design**: Works on desktop and mobile devices- **Responsive Design**: Works on desktop and mobile devices

- **Data Caching**: TanStack Query for efficient data fetching and caching- **Data Caching**: TanStack Query for efficient data fetching and caching



## 📊 Data Processing## 📊 Data Processing



The dashboard automatically calculates:The dashboard automatically calculates:

- **Response Time**: `onscene_datetime - received_datetime`- **Response Time**: \`onscene_datetime - received_datetime\`

- **Call Duration**: `close_datetime - received_datetime`- **Call Duration**: \`close_datetime - received_datetime\`

- **Temporal Analysis**: Hour of day, day of week, daily trends- **Temporal Analysis**: Hour of day, day of week, daily trends

- **Aggregate Metrics**: Averages, medians, counts by category- **Aggregate Metrics**: Averages, medians, counts by category



## 🛠️ Tech Stack## 🛠️ Tech Stack



- **Frontend Framework**: React 19 with TypeScript- **Frontend Framework**: React 19 with TypeScript

- **Build Tool**: Vite (Rolldown variant)- **Build Tool**: Vite (Rolldown variant)

- **Data Fetching**: TanStack Query (React Query) v5- **Data Fetching**: TanStack Query (React Query) v5

- **Charts**: Recharts- **Charts**: Recharts

- **Maps**: React Leaflet + Leaflet- **Maps**: React Leaflet + Leaflet

- **Styling**: Tailwind CSS v4- **Styling**: Tailwind CSS

- **Date Handling**: date-fns- **Date Handling**: date-fns



## 🚀 Running the App## 📦 Installation



1. Install dependencies:\`\`\`bash

   ```bash# Install dependencies

   npm installnpm install

   ```

# Start development server

2. Start the development server:npm run dev

   ```bash

   npm run dev# Build for production

   ```npm run build



3. Open your browser to the URL shown (typically `http://localhost:5173`)# Preview production build

npm run preview

4. The app will automatically fetch the latest 2,000 incident records from the SF Open Data API\`\`\`



## 📦 Available Scripts## 🚀 Running the App



```bash1. Install dependencies:

npm run dev      # Start development server   \`\`\`bash

npm run build    # Build for production   npm install

npm run preview  # Preview production build   \`\`\`

npm run lint     # Run ESLint

```2. Start the development server:

   \`\`\`bash

## 🏗️ Project Structure   npm run dev

   \`\`\`

```

src/3. Open your browser to the URL shown (typically \`http://localhost:5173\`)

├── components/

│   ├── Charts.tsx          # Analytics charts and summary stats4. The app will automatically fetch the latest 2,000 incident records from the SF Open Data API

│   ├── DataTable.tsx       # Sortable, paginated table

│   ├── Filters.tsx         # Filter controls sidebar## 🏗️ Project Structure

│   └── IncidentMap.tsx     # Leaflet map with markers

├── hooks/\`\`\`

│   └── useIncidents.ts     # React Query hooks for data fetchingsrc/

├── services/├── components/

│   └── api.ts              # API client for SF Open Data│   ├── Charts.tsx          # Analytics charts and summary stats

├── types/│   ├── DataTable.tsx       # Sortable, paginated table

│   └── incident.ts         # TypeScript interfaces│   ├── Filters.tsx         # Filter controls sidebar

├── utils/│   └── IncidentMap.tsx     # Leaflet map with markers

│   └── dataProcessing.ts   # Data transformation utilities├── hooks/

├── App.tsx                 # Main application component│   └── useIncidents.ts     # React Query hooks for data fetching

├── main.tsx               # Application entry point├── services/

└── index.css              # Global styles with Tailwind│   └── api.ts              # API client for SF Open Data

```├── types/

│   └── incident.ts         # TypeScript interfaces

## 🎯 Design Decisions├── utils/

│   └── dataProcessing.ts   # Data transformation utilities

### Data Architecture├── App.tsx                 # Main application component

- **Client-side filtering**: All 2,000 records are fetched once and filtered in-memory for fast, responsive interactions├── main.tsx               # Application entry point

- **Processed data**: Incidents are enriched with calculated fields (response time, hour of day, etc.) on load└── index.css              # Global styles with Tailwind

- **Memoization**: Heavy computations (unique values, chart data) are memoized with `useMemo` for performance\`\`\`



### UX Patterns## 🎯 Design Decisions

- **Progressive disclosure**: Data starts with overview (charts), then allows drilling into details (table)

- **Linked views**: Selections propagate between table and map for contextual exploration### Data Architecture

- **Visual hierarchy**: Color-coded priorities (red/orange/green) provide at-a-glance understanding- **Client-side filtering**: All 2,000 records are fetched once and filtered in-memory for fast, responsive interactions

- **Defensive design**: Graceful handling of missing data, loading states, and errors- **Processed data**: Incidents are enriched with calculated fields (response time, hour of day, etc.) on load

- **Memoization**: Heavy computations (unique values, chart data) are memoized with \`useMemo\` for performance

### Component Design

- **Separation of concerns**: Each component has a single responsibility### UX Patterns

- **Controlled components**: All state is managed in parent component for predictable data flow- **Progressive disclosure**: Data starts with overview (charts), then allows drilling into details (table)

- **TypeScript strict mode**: Full type safety- **Linked views**: Selections propagate between table and map for contextual exploration

- **Responsive layout**: CSS Grid for flexible layouts, Tailwind for utility-first styling- **Visual hierarchy**: Color-coded priorities (red/orange/green) provide at-a-glance understanding

- **Defensive design**: Graceful handling of missing data, loading states, and errors

### Performance Optimizations

- **TanStack Query**: 5-minute stale time prevents unnecessary refetches### Component Design

- **Pagination**: Table only renders 20 rows at a time- **Separation of concerns**: Each component has a single responsibility

- **Chart limits**: Top 10 items in most charts to avoid clutter- **Controlled components**: All state is managed in parent component for predictable data flow

- **Memoized computations**: Chart data and filters use React.useMemo- **TypeScript strict mode**: Full type safety with no \`any\` types

- **Responsive layout**: CSS Grid for flexible layouts, Tailwind for utility-first styling

## 🔧 API Details

### Performance Optimizations

**Data Source**: [SF Open Data - Law Enforcement Dispatched Calls for Service](https://data.sfgov.org/Public-Safety/Law-Enforcement-Dispatched-Calls-for-Service-Real-/gnap-fj3t)- **TanStack Query**: 5-minute stale time prevents unnecessary refetches

- **Pagination**: Table only renders 20 rows at a time

**Endpoint**: `https://data.sfgov.org/resource/gnap-fj3t.json`- **Chart limits**: Top 10 items in most charts to avoid clutter

- **Map clustering**: Visual grouping through CircleMarkers (production apps would use MarkerCluster)

**Fetch Strategy**: Fetches most recent 2,000 records sorted by `received_datetime DESC`

## 🔧 API Details

## 🤖 AI Usage

**Data Source**: [SF Open Data - Law Enforcement Dispatched Calls for Service](https://data.sfgov.org/Public-Safety/Law-Enforcement-Dispatched-Calls-for-Service-Real-/gnap-fj3t)

This dashboard was built with AI assistance (GitHub Copilot) which was used for:

- **Scaffolding**: Initial component structure and boilerplate code**Endpoint**: \`https://data.sfgov.org/resource/gnap-fj3t.json\`

- **Data transformation**: Utility functions for date parsing, calculations, and aggregations

- **TypeScript types**: Interface definitions based on API schema**Fetch Strategy**: Fetches most recent 2,000 records sorted by \`received_datetime DESC\`

- **Chart configurations**: Recharts component setup and data formatting

- **Map integration**: Leaflet/React-Leaflet setup and coordinate handling## 🤖 AI Usage

- **Documentation**: README structure and content

- **Styling**: Tailwind CSS class combinations and responsive layoutsThis dashboard was built with AI assistance (GitHub Copilot) which was used for:

- **Scaffolding**: Initial component structure and boilerplate

**Human oversight included**:- **Data transformation**: Utility functions for date parsing, calculations, and aggregations

- Architecture decisions and component hierarchy- **TypeScript types**: Interface definitions based on API schema

- UX design and interaction patterns- **Chart configurations**: Recharts component setup and data formatting

- Filter logic and state management- **Map integration**: Leaflet/React-Leaflet setup and coordinate handling

- Visual design and color schemes- **Documentation**: README structure and content

- Testing, debugging, and error handling

- Code review and refinement**Human oversight included**:

- Architecture decisions and component hierarchy

## 📝 Future Enhancements- UX design and interaction patterns

- Filter logic and state management

Potential improvements for production use:- Visual design and color schemes

- **Real-time updates**: WebSocket connection or polling for live data- Testing and debugging

- **Advanced filtering**: Date range presets, multi-select with AND/OR logic

- **Export functionality**: Download filtered data as CSV/JSON## 📝 Future Enhancements

- **Saved views**: Bookmark filter combinations

- **Map clustering**: MarkerClusterGroup for better performance with many markersPotential improvements for production use:

- **Heatmaps**: Temporal heatmaps showing call volume patterns- **Real-time updates**: WebSocket connection or polling for live data

- **Comparison views**: Compare metrics across time periods or districts- **Advanced filtering**: Date range presets, custom time ranges, multi-select with AND/OR logic

- **Accessibility**: Full WCAG 2.1 AA compliance, keyboard navigation- **Export functionality**: Download filtered data as CSV/JSON

- **Performance**: Virtual scrolling for table, lazy loading for charts- **Saved views**: Bookmark filter combinations

- **Map clustering**: MarkerClusterGroup for better performance with many markers

## 📄 License- **Heatmaps**: Temporal heatmaps showing call volume patterns

- **Comparison views**: Compare metrics across time periods or districts

This project is open source and available for educational purposes.- **Accessibility**: Full WCAG 2.1 AA compliance, keyboard navigation, screen reader support

- **Performance**: Virtual scrolling for table, lazy loading for charts

## 🙏 Acknowledgments

## 📄 License

- Data provided by the [City and County of San Francisco](https://datasf.org/)

- Maps from [OpenStreetMap](https://www.openstreetmap.org/)This project is open source and available for educational purposes.

- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and amazing open-source libraries

## 🙏 Acknowledgments

- Data provided by the [City and County of San Francisco](https://datasf.org/)
- Icons and maps from [OpenStreetMap](https://www.openstreetmap.org/)
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and amazing open-source libraries