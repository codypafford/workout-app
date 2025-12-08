import { useState, useMemo, useEffect } from 'react';
import '../style.css';

const MOCK_SAVED_WORKOUTS = [
  { id: 1, name: 'Chest Press' },
  { id: 2, name: 'Arm Curls' },
  { id: 3, name: 'Leg Press' },
  { id: 4, name: 'Squats' },
];

const AddWorkoutModal = ({ show, onClose, onAdd, new: isNew = false }) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setSelectedWorkoutId('');
      setNewWorkoutName('');
    }
  }, [show]);

  // Alphabetize workouts
  const sortedWorkouts = useMemo(() => {
    return [...MOCK_SAVED_WORKOUTS].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  const handleAddClick = () => {
    // New-only mode
    if (isNew) {
      if (!newWorkoutName.trim()) return;

      onAdd({
        id: Date.now(),
        name: newWorkoutName.trim(),
      });

      onClose();
      return;
    }

    // Mixed mode
    if (selectedWorkoutId === 'new' && newWorkoutName.trim()) {
      onAdd({
        id: Date.now(),
        name: newWorkoutName.trim(),
      });
      onClose();
      return;
    }

    const selectedWorkout = MOCK_SAVED_WORKOUTS.find(
      (w) => w.id === parseInt(selectedWorkoutId, 10)
    );

    if (selectedWorkout) {
      onAdd(selectedWorkout);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Exercise</h2>

        {/* ✅ New-only mode */}
        {isNew ? (
          <input
            type="text"
            placeholder="Workout Name"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            style={{ marginTop: '12px', width: '100%' }}
            autoFocus
          />
        ) : (
          <>
            <label htmlFor="workout-select">
              Select a workout or add new:
            </label>

            <select
              id="workout-select"
              value={selectedWorkoutId}
              onChange={(e) => setSelectedWorkoutId(e.target.value)}
            >
              <option value="">-- Select a workout --</option>
              {sortedWorkouts.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
              <option value="new">+ Add a new workout</option>
            </select>

            {selectedWorkoutId === 'new' && (
              <input
                type="text"
                placeholder="Workout Name"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                style={{ marginTop: '8px', width: '100%' }}
              />
            )}
          </>
        )}

        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleAddClick}
            disabled={
              isNew
                ? !newWorkoutName.trim()
                : !selectedWorkoutId ||
                  (selectedWorkoutId === 'new' && !newWorkoutName.trim())
            }
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
