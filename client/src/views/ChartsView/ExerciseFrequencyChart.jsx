import { useState, useMemo } from 'react'
import { ExerciseFreqTooltip } from './Tooltips'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import moment from 'moment'

const ExerciseFrequencyChart = ({ data, selectedExercises, colors }) => {
  const [frequency, setFrequency] = useState('1w') // '1w', '3m', '6m'
  const getPeriodKey = (dateStr) => {
    const d = moment(dateStr)
    if (frequency === '1w') return d.startOf('week').format('YYYY-MM-DD')
    if (frequency === '3m' || frequency === '6m')
      return d.startOf('month').format('YYYY-MM')
    return d.format('YYYY-MM-DD')
  }

  const freqData = useMemo(() => {
    const periodMap = {}

    // Determine cutoff date
    const cutoff = moment()
      .subtract(
        frequency === '1w' ? 1 : frequency === '3m' ? 3 : 6,
        frequency === '1w' ? 'weeks' : 'months'
      )
      .startOf(frequency === '1w' ? 'week' : 'month')

    const end = moment().endOf('day')

    // Generate all periods between cutoff and today
    let current = cutoff.clone()
    while (current.isSameOrBefore(end)) {
      const key =
        frequency === '1w'
          ? current.format('YYYY-MM-DD')
          : current.format('YYYY-MM')
      periodMap[key] = { period: key }
      selectedExercises.forEach((ex) => (periodMap[key][ex] = 0))
      current.add(
        frequency === '1w' ? 1 : 1,
        frequency === '1w' ? 'week' : 'month'
      )
    }

    // Fill in actual data
    data
      .filter((day) => moment(day.date).isSameOrAfter(cutoff))
      .forEach((day) => {
        const period = getPeriodKey(day.date)
        selectedExercises.forEach((ex) => {
          const matchedKey = Object.keys(day).find(
            (key) => key.toLowerCase() === ex.toLowerCase()
          )
          if (matchedKey) {
            periodMap[period][ex] += day[matchedKey] ?? 0
          }
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
              return frequency === '1w' ? d.format('M/D') : d.format('MMM YY')
            }}
          />
          <YAxis />
          <Tooltip content={<ExerciseFreqTooltip frequency={frequency} />} />
          <Legend wrapperStyle={{ zIndex: 1 }} />
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

      <ResponsiveContainer width='100%' height={300}>
        <AreaChart data={freqData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='period'
            tickFormatter={(str) => {
              const d = moment(str)
              return frequency === '1w' ? d.format('M/D') : d.format('MMM YY')
            }}
          />
          <YAxis />
          <Tooltip content={<ExerciseFreqTooltip frequency={frequency} />} />
          <Legend wrapperStyle={{ zIndex: 1 }} />
          {selectedExercises.map((ex, idx) => (
            <Area
              key={ex}
              type='monotone'
              dataKey={ex}
              stackId='1'
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              name={ex}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExerciseFrequencyChart
