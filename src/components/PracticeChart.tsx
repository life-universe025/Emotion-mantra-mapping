import { IoBarChart } from 'react-icons/io5'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface ChartDataPoint {
  date?: string
  week?: string
  dateLabel?: string
  weekLabel?: string
  sessions: number
  repetitions: number
  duration: number
}

interface PracticeChartProps {
  data: ChartDataPoint[]
  type: 'line' | 'bar' | 'area'
  metric: 'sessions' | 'repetitions' | 'duration'
  timeframe: 'daily' | 'weekly'
  height?: number
}

const metricConfig = {
  sessions: {
    label: 'Sessions',
    color: '#f59e0b', // amber-500
    unit: ''
  },
  repetitions: {
    label: 'Repetitions',
    color: '#ea580c', // orange-600
    unit: ''
  },
  duration: {
    label: 'Duration',
    color: '#d97706', // amber-600
    unit: ' min'
  }
}

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (active && payload && payload.length) {
    const config = metricConfig[metric as keyof typeof metricConfig]
    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-amber-200 dark:border-amber-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          {payload[0].payload.dateLabel || payload[0].payload.weekLabel || label}
        </p>
        <p className="text-sm" style={{ color: config.color }}>
          {`${config.label}: ${payload[0].value}${config.unit}`}
        </p>
      </div>
    )
  }
  return null
}

export function PracticeChart({ data, type, metric, timeframe, height = 200 }: PracticeChartProps) {
  const config = metricConfig[metric]
  const xAxisKey = timeframe === 'daily' ? 'dateLabel' : 'weekLabel'

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-amber-600 dark:text-amber-400 text-sm"
        style={{ height }}
      >
        <div className="text-center">
          <IoBarChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <div>No practice data yet</div>
        </div>
      </div>
    )
  }

  const commonProps = {
    data,
    margin: { top: 5, right: 5, left: 5, bottom: 5 }
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" opacity={0.2} />
            <XAxis 
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#92400e' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#92400e' }}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} metric={metric} />} />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              strokeWidth={2}
              dot={{ fill: config.color, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: config.color, strokeWidth: 2, fill: 'white' }}
            />
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" opacity={0.2} />
            <XAxis 
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#92400e' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#92400e' }}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} metric={metric} />} />
            <Bar
              dataKey={metric}
              fill={config.color}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" opacity={0.2} />
            <XAxis 
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#92400e' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#92400e' }}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} metric={metric} />} />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              strokeWidth={2}
              fill={config.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart() || <div>No chart data</div>}
      </ResponsiveContainer>
    </div>
  )
}
