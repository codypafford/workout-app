import { useParams, Link } from 'react-router-dom';
import './style.css';

const MOCK_EXERCISES = [
  {
    id: 1,
    name: 'Chest Press',
    logs: [
      {
        date: '2025-12-01',
        sets: 3,
        reps: 10,
        weight: 135,
        notes: 'Felt strong, good form',
        photo: '/image.png'
      },
      {
        date: '2025-12-04',
        sets: 4,
        reps: 8,
        weight: 140,
        notes: 'Slight shoulder discomfort',
        photo: '/image.png'
      }
    ]
  },
  {
    id: 2,
    name: 'Arm Curls',
    logs: [
      {
        date: '2025-12-02',
        sets: 3,
        reps: 12,
        weight: 25,
        notes: 'Could increase weight next time',
        photo: '/image.png'
      }
    ]
  },
  {
    id: 3,
    name: 'Leg Press',
    logs: [
      {
        date: '2025-12-03',
        sets: 4,
        reps: 10,
        weight: 200,
        notes: 'Good depth, stable',
        photo: '/image.png'
      }
    ]
  }
];

const ExerciseView = () => {
  const { id } = useParams();
  const exerciseId = parseInt(id);
  const exercise = MOCK_EXERCISES.find((ex) => ex.id === exerciseId);

  if (!exercise) return <div>Exercise not found</div>;

  return (
    <div className="exercise-view">
      {/* Breadcrumb */}
      <div className="exercise-breadcrumb">
        <Link to="/">← Back to Workouts</Link>
      </div>

      <h2>{exercise.name}</h2>

      {exercise.logs.length === 0 ? (
        <p>No previous logs for this exercise.</p>
      ) : (
        <div className="exercise-logs">
          {exercise.logs.map((log, index) => (
            <div key={index} className="exercise-log">
              <div className="exercise-log-header">
                <strong>Date:</strong> {log.date}
              </div>
              <div className="exercise-log-body">
                <p>
                  <strong>Sets:</strong> {log.sets} | <strong>Reps:</strong>{' '}
                  {log.reps} | <strong>Weight:</strong> {log.weight} lbs
                </p>
                <p>
                  <strong>Notes:</strong> {log.notes}
                </p>
                {log.photo && (
                  <img
                    src={log.photo}
                    alt={`Log ${index + 1}`}
                    className="exercise-log-photo"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseView;
