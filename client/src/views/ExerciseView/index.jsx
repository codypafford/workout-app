import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './style.css'

const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Chest Press',
    photo: '/image.png',
    logs: [
      {
        date: '2025-12-01',
        sets: 3,
        reps: 10,
        weight: 135,
        notes: 'Felt strong, good form'
      },
      {
        date: '2025-12-04',
        sets: 4,
        reps: 8,
        weight: 140,
        notes: 'Slight shoulder discomfort'
      },
      {
        date: '2025-12-04',
        sets: 4,
        reps: 8,
        weight: 140,
        notes: 'Slight shoulder discomfort'
      },
      {
        date: '2025-12-04',
        sets: 4,
        reps: 8,
        weight: 140,
        notes: 'Slight shoulder discomfort'
      },
      {
        date: '2025-12-04',
        sets: 4,
        reps: 8,
        weight: 140,
        notes: 'Slight shoulder discomfort'
      },
      {
        date: '2025-12-04',
        sets: 4,
        reps: 8,
        weight: 140,
        notes: 'Slight shoulder discomfort'
      }
    ]
  },
  {
    id: 2,
    name: 'Arm Curls',
    photo: '/image.png',
    logs: [
      {
        date: '2025-12-02',
        sets: 3,
        reps: 12,
        weight: 25,
        notes: 'Could increase weight next time'
      }
    ]
  },
  {
    id: 3,
    name: 'Leg Press',
    photo: '/image.png',
    logs: [
      {
        date: '2025-12-03',
        sets: 4,
        reps: 10,
        weight: 200,
        notes: 'Good depth, stable'
      }
    ]
  }
]

const ExerciseView = () => {
  const { id } = useParams()
  const exerciseId = parseInt(id)
  const exercise = MOCK_EXERCISES.find((ex) => ex.id === exerciseId)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!exercise) return <div className='exercise-view'>Exercise not found</div>

  // Group logs by date
  const logsByDate = exercise.logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = []
    acc[log.date].push(log)
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
            const totalWeight = logsByDate[date].reduce(
              (sum, log) => sum + log.sets * log.reps * log.weight,
              0
            )

            return (
              <div key={date} className='exercise-view__log-date-group'>
                <div className='exercise-view__log-date'>{date}</div>
                <div className='exercise-view__log-total'>
                  Total Weight Lifted: {totalWeight} lbs
                </div>
                {logsByDate[date].map((log, idx) => (
                  <div key={idx} className='exercise-view__log'>
                    <p className='exercise-view__log-info'>
                      <strong>Sets:</strong> {log.sets} | <strong>Reps:</strong>{' '}
                      {log.reps} | <strong>Weight:</strong> {log.weight} lbs
                    </p>
                    {log.notes && (
                      <p className='exercise-view__log-notes'>
                        <strong>Notes:</strong> {log.notes}
                      </p>
                    )}
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
