import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const RollingAverageChart = ({ data, selectedExercises, colors }) => {
  // Calculate 7-day rolling average
  const rollingData = data.map((day, idx) => {
    const newDay = { date: day.date }
    selectedExercises.forEach((ex) => {
      const slice = data.slice(Math.max(0, idx - 6), idx + 1) // last 7 days
      const sum = slice.reduce((acc, d) => acc + (d[ex] || 0), 0)
      newDay[ex] = +(sum / slice.length).toFixed(1) // average
    })
    return newDay
  })

  return (
    <div className='charts-view__chart-block'>
      <h3>7-Day Rolling Average of Total Volume (Weight × Reps × Sets)</h3>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={rollingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            tickFormatter={(dateStr) => {
              const d = new Date(dateStr)
              return `${d.getMonth() + 1}/${d.getDate()}` // MM/DD
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedExercises.map((ex, idx) => (
            <Line
              key={ex}
              type='monotone'
              dataKey={ex}
              stroke={colors[idx % colors.length]}
              name={ex}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RollingAverageChart
