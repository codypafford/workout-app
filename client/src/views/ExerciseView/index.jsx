import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchExercise } from '../../proxies'
import './style.css'

const ExerciseView = () => {
  const { id } = useParams()
  const exerciseId = id // assuming your API uses string IDs
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch exercise on mount or when id changes
  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchExercise(exerciseId)
      .then((data) => {
        setExercise(data)
        setLoading(false)
        window.scrollTo(0, 0) // scroll to top
      })
      .catch((err) => {
        console.error('Error fetching exercise:', err)
        setError('Failed to load exercise')
        setLoading(false)
      })
  }, [exerciseId])

  if (loading) return <div className='exercise-view'>Loading...</div>
  if (error) return <div className='exercise-view'>{error}</div>
  if (!exercise) return <div className='exercise-view'>Exercise not found</div>

  // Group logs by date, then merge same weight+reps
  const logsByDate = exercise.logs.reduce((acc, log) => {
    const dateKey = new Date(log.date).toISOString().split('T')[0] // YYYY-MM-DD
    if (!acc[dateKey]) acc[dateKey] = []

    // Check if a log with same weight and reps already exists
    const existing = acc[dateKey].find(
      (l) => l.weight === log.weight && l.reps === log.reps
    )

    if (existing) {
      existing.sets += log.sets
      // Optionally merge notes
      if (log.notes)
        existing.notes = existing.notes
          ? `${existing.notes}; ${log.notes}`
          : log.notes
    } else {
      acc[dateKey].push({ ...log }) // copy log
    }

    return acc
  }, {})
  const sortedDates = Object.keys(logsByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  )
  return (
    <div className='exercise-view'>
      <div className='exercise-view__breadcrumb'>
        <Link to='/' className='exercise-view__breadcrumb-link'>
          ← Back to Workouts
        </Link>
      </div>

      <div className='exercise-view__header'>
        <h2 className='exercise-view__title'>{exercise.name}</h2>
        {exercise.photo && (
          <img
            src={exercise.photo}
            alt={exercise.name}
            className='exercise-view__photo'
          />
        )}
      </div>

      {exercise.logs.length === 0 ? (
        <p className='exercise-view__no-logs'>
          No previous logs for this exercise.
        </p>
      ) : (
        <div className='exercise-view__logs'>
          {sortedDates.map((date) => {
            return (
              <div key={date} className='exercise-view__log-date-group'>
                <div className='exercise-view__log-date'>{date}</div>

                {logsByDate[date]
                  .filter((log) => log.notes)
                  .map((log, idx) => (
                    <div key={idx} className='exercise-view__log'>
                      <p className='exercise-view__log-notes'>
                        <strong>Notes:</strong> {log.notes}
                      </p>
                    </div>
                  ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExerciseView
