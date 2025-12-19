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
import { ExerciseTooltip } from './Tooltips'
import MultiSelectDropdown from '../../components/MultiSelectDropDown'
import './style.css'

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f50',
  '#8dd1e1',
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
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedExercises, setSelectedExercises] = useState([]) // <-- multiple

  const loadChartData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchChartData(startDate, endDate)
      const exercisesSet = new Set()
      data.forEach((day) => {
        Object.keys(day).forEach((key) => {
          if (key !== 'date') exercisesSet.add(key)
        })
      })
      const exercisesArray = [...exercisesSet].sort()
      setAllExercises(exercisesArray)

      const normalizedData = data.map((day) => {
        const newDay = { date: day.date, _meta: {} }
        exercisesArray.forEach((ex) => {
          const exerciseData = day[ex]
          newDay[ex] = exerciseData?.totalWeight ?? null
          if (exerciseData) newDay._meta[ex] = exerciseData
        })
        return newDay
      })
      setChartData(normalizedData)

      if (selectedExercises.length === 0 && exercisesArray.length > 0) {
        setSelectedExercises([exercisesArray[0]])
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

  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    )
  }

  if (loading) return <p className='charts-view__loading'>Loading charts...</p>
  if (error) return <p className='charts-view__error'>{error}</p>

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

        <MultiSelectDropdown
          options={allExercises}
          selected={selectedExercises}
          onChange={setSelectedExercises}
        />
      </div>

      <div className='charts-view__chart-block'>
        <h3>Total Weight by Exercise</h3>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip content={<ExerciseTooltip />} />
            <Legend />
            {selectedExercises.map((ex, idx) => (
              <Line
                key={ex}
                type='monotone'
                connectNulls
                dataKey={ex}
                stroke={COLORS[idx % COLORS.length]}
                name={ex}
              />
            ))}
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
            <Tooltip content={<ExerciseTooltip />} />
            <Legend />
            {selectedExercises.map((ex, idx) => (
              <Bar
                key={ex}
                dataKey={ex}
                fill={COLORS[idx % COLORS.length]}
                name={ex}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartsView
