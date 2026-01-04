import { useState, useMemo } from 'react'
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
import moment from 'moment'

const ExerciseFrequencyChart = ({ data, selectedExercises, colors }) => {
  const [frequency, setFrequency] = useState('1w') // '1w', '3m', '6m'

  // Helper to get start of the week/month for grouping
  const getPeriodKey = (dateStr) => {
    const d = moment(dateStr)
    if (frequency === '1w') return d.startOf('week').format('YYYY-MM-DD')
    if (frequency === '3m') return d.startOf('month').format('YYYY-MM')
    if (frequency === '6m') return d.startOf('month').format('YYYY-MM')
    return d.format('YYYY-MM-DD')
  }

  const freqData = useMemo(() => {
    const periodMap = {}

    // Filter data for last X period
    const cutoff = moment()
      .subtract(
        frequency === '1w' ? 1 : frequency === '3m' ? 3 : 6,
        frequency === '1w' ? 'weeks' : 'months'
      )

    data
      .filter((d) => moment(d.date).isSameOrAfter(cutoff))
      .forEach((day) => {
        const period = getPeriodKey(day.date)
        if (!periodMap[period]) periodMap[period] = { period }
        selectedExercises.forEach((ex) => {
          if (!periodMap[period][ex]) periodMap[period][ex] = 0
          if (day[ex]) periodMap[period][ex] += 1
        })
      })

    return Object.values(periodMap)
  }, [data, selectedExercises, frequency])

  return (
    <div className='charts-view__chart-block'>
      <h3>Exercise Frequency</h3>

      {/* Frequency Selector */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          View:
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            <option value='1w'>Last Week (per week)</option>
            <option value='3m'>Last 3 Months (per month)</option>
            <option value='6m'>Last 6 Months (per month)</option>
          </select>
        </label>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={freqData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='period'
            tickFormatter={(str) => {
              const d = moment(str)
              if (frequency === '1w') return d.format('M/D')
              return d.format('MMM YY')
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
