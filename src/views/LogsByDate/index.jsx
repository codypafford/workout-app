// src/views/Logs/LogsByDate.jsx
import { useParams, Link } from 'react-router-dom';
// import './style.css';

const MOCK_LOGS = [
  {
    date: '2025-12-01',
    groups: [
      { name: 'Upper Body', workouts: [{ name: 'Chest Press', sets: 3, reps: 10, weight: 135, notes: 'Felt strong' }] },
      { name: 'Leg Day', workouts: [] }
    ]
  },
  {
    date: '2025-12-02',
    groups: [
      { name: 'Upper Body', workouts: [{ name: 'Arm Curls', sets: 3, reps: 12, weight: 25, notes: '' }] },
      { name: 'Leg Day', workouts: [{ name: 'Leg Press', sets: 4, reps: 10, weight: 200, notes: 'Good form' }] }
    ]
  }
];

const LogsByDate = () => {
  const { date } = useParams();
  const log = MOCK_LOGS.find(l => l.date === date);

  if (!log) return <div>No logs for this date</div>;

  return (
    <div className="logs-by-date">
      <Link to="/logs">&larr; Back to Logs Overview</Link>
      <h2>Logs for {date}</h2>

      {log.groups.map(group => (
        <div key={group.name} className="logs-by-date__group">
          <h3>{group.name}</h3>
          {group.workouts.length === 0 ? (
            <p>No workouts logged</p>
          ) : (
            <ul>
              {group.workouts.map((w, idx) => (
                <li key={idx}>
                  <strong>{w.name}</strong> — {w.sets} sets x {w.reps} reps @ {w.weight} lbs
                  {w.notes && <p>Notes: {w.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

export default LogsByDate;
