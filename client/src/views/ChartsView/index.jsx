import { useState, useEffect } from 'react'
import { ResponsiveContainer } from 'recharts'
import { fetchChartData } from '../../proxies'
import MultiSelectDropdown from '../../components/MultiSelectDropDown'
import ExerciseFrequencyChart from './ExerciseFrequencyChart'
import './style.css'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1']

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
  const [selectedExercises, setSelectedExercises] = useState([]) // <-- multiple

  const loadChartData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchChartData(startDate) // only pass startDate
      const exercisesSet = new Set()
      data.forEach((day) => {
        Object.keys(day).forEach((key) => {
          if (key !== 'date') exercisesSet.add(key)
        })
      })
      const exercisesArray = [...exercisesSet].sort()
      setAllExercises(exercisesArray)

      const normalizedData = data.map((day) => {
        const newDay = { date: day.date }
        exercisesArray.forEach((ex) => {
          const exerciseData = day[ex]
          newDay[ex] = exerciseData?.count ?? 0
        })
        return newDay
      })
      setChartData(normalizedData)

      // Calculate top 5 exercises by total count
      const exerciseTotals = exercisesArray.map((ex) => {
        const total = normalizedData.reduce(
          (sum, day) => sum + (day[ex] || 0),
          0
        )
        return { exercise: ex, total }
      })
      exerciseTotals.sort((a, b) => b.total - a.total)
      const top5 = exerciseTotals.slice(0, 5).map((e) => e.exercise)

      setSelectedExercises(top5)
    } catch (err) {
      console.error('Failed to fetch chart data:', err)
      setError('Failed to fetch chart data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChartData()
  }, [startDate])

  if (loading) return <p className='charts-view__loading'>Loading charts...</p>
  if (error) return <p className='charts-view__error'>{error}</p>

  return (
    <div className='charts-view'>
      <div className='charts-view__controls'>
        {/* <div className='charts-view__range-selector'>
          <label>
            Start Date:
            <input
              type='date'
              value={startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
        </div> */}

        <MultiSelectDropdown
          options={allExercises}
          selected={selectedExercises}
          onChange={setSelectedExercises}
        />
      </div>

      <div className='charts-view__chart-block'>
        <ExerciseFrequencyChart
          data={chartData}
          selectedExercises={selectedExercises}
          colors={COLORS}
        />
      </div>
    </div>
  )
}

export default ChartsView
