import { useState, useEffect } from 'react'
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
import { fetchChartData } from '../../proxies'
import './style.css'

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f50',
  '#a28fd0',
  '#8dd1e1',
  '#d0ed57',
  '#d88484'
]

const ChartsView = () => {
  const [chartData, setChartData] = useState([])
  const [allExercises, setAllExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1)
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split('T')[0]
  )
  const [selectedExercise, setSelectedExercise] = useState('')

  const loadChartData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchChartData(startDate, endDate)

      // Collect all exercises
      const exercisesSet = new Set()
      data.forEach((day) => {
        Object.keys(day).forEach((key) => {
          if (key !== 'date') exercisesSet.add(key)
        })
      })
      const exercisesArray = [...exercisesSet].sort()
      setAllExercises(exercisesArray)

      // Normalize data so every day has all exercises
      const normalizedData = data.map((day) => {
        const newDay = { date: day.date }
        exercisesArray.forEach((ex) => {
          newDay[ex] = day[ex] || 0
        })
        return newDay
      })
      setChartData(normalizedData)

      // Set default selected exercise if not already set
      if (!selectedExercise && exercisesArray.length > 0) {
        setSelectedExercise(exercisesArray[0])
      }
    } catch (err) {
      console.error('Failed to fetch chart data:', err)
      setError('Failed to fetch chart data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChartData()
  }, [startDate, endDate])

  if (loading) return <p className='charts-view__loading'>Loading charts...</p>
  if (error) return <p className='charts-view__error'>{error}</p>
  //   if (!chartData.length) return <p className="charts-view__empty">No data for this range</p>

  return (
    <div className='charts-view'>
      <div className='charts-view__controls'>
        <div className='charts-view__range-selector'>
          <label>
            Start Date:
            <input
              type='date'
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type='date'
              value={endDate}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        <div className='charts-view__exercise-selector'>
          <label>
            Exercise:
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {allExercises.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className='charts-view__chart-block'>
        <h3>Total Weight by Exercise</h3>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedExercise && (
              <Line
                type='monotone'
                dataKey={selectedExercise}
                stroke={COLORS[0]}
                name={selectedExercise}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='charts-view__chart-block'>
        <h3>Total Weight by Exercise</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedExercise && (
              <Bar
                dataKey={selectedExercise}
                fill={COLORS[0]}
                name={selectedExercise}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartsView
