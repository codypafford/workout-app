import { useState, useEffect } from 'react';
import AddWorkoutModal from '../../Modals/AddWorkout';
import { addExercise, fetchExercises } from '../../proxies';
import './style.css';

const ROOT_CN = 'exercises-view';

export default function ExercisesView() {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch exercises on mount
  const loadExercises = async () => {
    try {
      const data = await fetchExercises(); // proxy handles /api/exercises
      setExercises(data.map(ex => ({
        id: ex._id,
        name: ex.name,
        photo: ex.photo || '/image.png'
      })));
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  // Handle adding new exercise
  const handleAddExercise = async (exercise) => {
    try {
      const newExercise = await addExercise(exercise); // POST via proxy
      // TODO: refetch instead of doing ths in memory
      setExercises(prev => [
        ...prev,
        {
          id: newExercise._id,
          name: newExercise.name,
          photo: newExercise.photo || '/image.png'
        }
      ]);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add exercise:', err);
    }
  };

  const deleteExerciseLocal = (id) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className={ROOT_CN}>
      <div className={`${ROOT_CN}__header`}>
        <h2 className={`${ROOT_CN}__title`}>Exercises</h2>
        <button
          className={`${ROOT_CN}__add-btn`}
          onClick={() => setShowModal(true)}
        >
          + Add Exercise
        </button>
      </div>

      <div className={`${ROOT_CN}__grid`}>
        {exercises.map(exercise => (
          <div key={exercise.id} className={`${ROOT_CN}__card`}>
            <img
              src={exercise.photo}
              alt={exercise.name}
              className={`${ROOT_CN}__image`}
            />

            <div className={`${ROOT_CN}__card-footer`}>
              <span className={`${ROOT_CN}__name`}>
                {exercise.name}
              </span>

              <button
                className={`${ROOT_CN}__delete-btn`}
                onClick={() => deleteExerciseLocal(exercise.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className={`${ROOT_CN}__empty`}>
          No exercises yet.
        </div>
      )}

      {/* Modal */}
      <AddWorkoutModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddExercise}
        new
      />
    </div>
  );
}
