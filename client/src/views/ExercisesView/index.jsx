import { useState } from 'react';
import AddWorkoutModal from '../../Modals/AddWorkout';
import './style.css';

const ROOT_CN = 'exercises-view';

const initialExercises = [
  { id: 1, name: 'Bench Press', photo: '/image.png' },
  { id: 2, name: 'Squat', photo: '/image.png' },
  { id: 3, name: 'Deadlift', photo: '/image.png' },
];

export default function ExercisesView() {
  const [exercises, setExercises] = useState(initialExercises);
  const [showModal, setShowModal] = useState(false);

  const handleAddExercise = (workout) => {
    setExercises(prev => {
      // optional: prevent duplicates by name
      if (prev.some(e => e.name === workout.name)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: workout.id,
          name: workout.name,
          photo: '/image.png', // default photo for now
        },
      ];
    });
  };

  const deleteExercise = (id) => {
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
                onClick={() => deleteExercise(exercise.id)}
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
