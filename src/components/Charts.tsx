import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { ProcessedIncident } from '../types/incident';
import { calculateAverage, calculateMedian } from '../utils/dataProcessing';

interface ChartsProps {
  data: ProcessedIncident[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function Charts({ data }: ChartsProps) {
  const callTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((incident) => {
      const type = incident.call_type_final_desc || 'Unknown';
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data]);

  const hourlyData = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      counts[i] = 0;
    }

    data.forEach((incident) => {
      if (incident.hourOfDay !== undefined) {
        counts[incident.hourOfDay]++;
      }
    });

    return Object.entries(counts).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count,
    }));
  }, [data]);

  const dayOfWeekData = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts: Record<string, number> = {};
    days.forEach((day) => {
      counts[day] = 0;
    });

    data.forEach((incident) => {
      if (incident.dayOfWeek) {
        counts[incident.dayOfWeek]++;
      }
    });

    return days.map((day) => ({
      day: day.slice(0, 3),
      count: counts[day],
    }));
  }, [data]);

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((incident) => {
      const priority = incident.priority_final || 'Unknown';
      counts[priority] = (counts[priority] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        // Sort A, B, C, then others
        const order: Record<string, number> = { A: 0, B: 1, C: 2 };
        const aOrder = order[a.name] ?? 999;
        const bOrder = order[b.name] ?? 999;
        return aOrder - bOrder;
      });
  }, [data]);

  const responseTimesByDistrict = useMemo(() => {
    const districtTimes: Record<string, number[]> = {};
    
    data.forEach((incident) => {
      if (incident.police_district && incident.responseTimeMinutes !== undefined && incident.responseTimeMinutes >= 0) {
        if (!districtTimes[incident.police_district]) {
          districtTimes[incident.police_district] = [];
        }
        districtTimes[incident.police_district].push(incident.responseTimeMinutes);
      }
    });

    return Object.entries(districtTimes)
      .map(([district, times]) => ({
        district,
        avg: calculateAverage(times),
        median: calculateMedian(times),
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);
  }, [data]);

  const dailyTrend = useMemo(() => {
    const counts: Record<string, number> = {};
    
    data.forEach((incident) => {
      if (incident.date) {
        counts[incident.date] = (counts[incident.date] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }, [data]);

  const stats = useMemo(() => {
    const responseTimes = data
      .map((i) => i.responseTimeMinutes)
      .filter((t): t is number => t !== undefined && t >= 0);

    return {
      total: data.length,
      highPriority: data.filter((i) => i.priority_final === 'A').length,
      avgResponseTime: calculateAverage(responseTimes),
      medianResponseTime: calculateMedian(responseTimes),
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Total Incidents</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{stats.total.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">High Priority (A)</div>
          <div className="mt-1 text-3xl font-semibold text-red-600">{stats.highPriority.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Avg Response Time</div>
          <div className="mt-1 text-3xl font-semibold text-blue-600">
            {Math.round(stats.avgResponseTime)}
            <span className="text-lg">m</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Median Response Time</div>
          <div className="mt-1 text-3xl font-semibold text-green-600">
            {Math.round(stats.medianResponseTime)}
            <span className="text-lg">m</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Call Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Call Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={callTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: unknown) => {
                  const { name, value, percent } = props as { name: string; value: number; percent: number };
                  return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents by Hour of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" angle={-45} textAnchor="end" height={60} fontSize={11} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Day of Week */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayOfWeekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response Times by District */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Average Response Time by District (Top 10)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTimesByDistrict} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Minutes', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="district" type="category" width={120} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="#F59E0B" name="Average" />
              <Bar dataKey="median" fill="#8B5CF6" name="Median" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Trend */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Incident Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} fontSize={11} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
