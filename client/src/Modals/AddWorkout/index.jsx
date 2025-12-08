import { useState, useMemo, useEffect } from 'react';
import { fetchExercises } from '../../proxies';
import '../style.css';

const AddWorkoutModal = ({ show, onClose, onAdd, new: isNew = false }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    console.log('on mount!!')
    if (show) {
      setSelectedWorkoutId('');
      setNewWorkoutName('');
      if (!isNew) loadExercises();
    }
  }, [show, isNew]);

  // Fetch exercises from backend
  const loadExercises = async () => {
    try {
      const data = await fetchExercises();
      setExercises(
        data.map((ex) => ({
          id: ex._id,
          name: ex.name,
          photo: ex.photo || '/image.png',
        }))
      );
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  };

  // Alphabetize exercises
  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises]);

  const handleAddClick = () => {
    let exerciseToAdd;

    if (isNew || selectedWorkoutId === 'new' || selectedWorkoutId === '') {
      if (!newWorkoutName.trim()) return;
      exerciseToAdd = { id: '', name: newWorkoutName.trim(), photo: '', isNew: true };
    } else {
      exerciseToAdd = sortedExercises.find(ex => ex.id === selectedWorkoutId);
      if (exerciseToAdd) exerciseToAdd.isNew = false;
    }

    if (exerciseToAdd) {
      onAdd(exerciseToAdd);
      onClose();
    }
  };
  console.log('is modal open: ', show)
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Exercise</h2>

        {isNew ? (
          <input
            type="text"
            placeholder="Exercise Name"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            style={{ marginTop: '12px', width: '100%' }}
            autoFocus
          />
        ) : (
          <>
            <label htmlFor="exercise-select">
              Select an existing exercise or add new:
            </label>

            <select
              id="exercise-select"
              value={selectedWorkoutId}
              onChange={(e) => setSelectedWorkoutId(e.target.value)}
            >
              <option value="">-- Select an exercise --</option>
              {sortedExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
              <option value="new">+ Add a new exercise</option>
            </select>

            {(selectedWorkoutId === 'new') && (
              <input
                type="text"
                placeholder="Exercise Name"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                style={{ marginTop: '8px', width: '100%' }}
              />
            )}
          </>
        )}

        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button className="close" onClick={onClose}>Cancel</button>

          <button
            className="confirm"
            onClick={handleAddClick}
            disabled={
              (isNew || selectedWorkoutId === 'new') && !newWorkoutName.trim()
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
