import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer
} from 'recharts'

const ExerciseFrequencyChart = ({ data, selectedExercises, colors }) => {
  const freqData = []
  const weekMap = {}

  data.forEach((day) => {
    const week = new Date(day.date).toISOString().slice(0, 7) // YYYY-MM week-ish
    if (!weekMap[week]) weekMap[week] = { week }
    selectedExercises.forEach((ex) => {
      if (!weekMap[week][ex]) weekMap[week][ex] = 0
      if (day[ex]) weekMap[week][ex] += 1 // count session
    })
  })

  Object.values(weekMap).forEach((d) => freqData.push(d))
  return (
    <div className='charts-view__chart-block'>
      <h3>Exercise Frequency (per week)</h3>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={freqData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='week'
            tickFormatter={(weekStr) => {
              // If weekStr is a date string
              const d = new Date(weekStr)
              return `${d.getMonth() + 1}/${d.getDate()}` // MM/DD
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedExercises.map((ex, idx) => (
            <Bar
              key={ex}
              dataKey={ex}
              fill={colors[idx % colors.length]}
              name={ex}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExerciseFrequencyChart
