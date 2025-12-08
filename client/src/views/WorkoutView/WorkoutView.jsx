import { useState } from 'react'
import { Link } from 'react-router-dom'
import WorkoutList from '../../components/WorkoutList'
import AddWorkoutGroupModal from '../../Modals/AddWorkoutGroup'
import './style.css'

const WorkoutView = () => {
  const ROOT_CN = 'workout-view'
  const [modalOpen, setModalOpen] = useState(false) // state for modal

  const lists = [
    {
      id: 1,
      groupName: 'Upper Body',
      group: [
        {
          id: 1,
          name: 'Chest Press',
          last: [
            { sets: 3, reps: 10, weight: 135 },
            { sets: 4, reps: 8, weight: 140 }
          ],
          today: [{ sets: 3, reps: 10, weight: 140 }],
          image: '/image.png'
        },
        {
          id: 2,
          name: 'Arm Curls',
          last: [
            { sets: 3, reps: 12, weight: 25 },
            { sets: 3, reps: 10, weight: 30 }
          ],
          today: []
        },
        {
          id: 3,
          name: 'Tricep Extensions',
          last: [{ sets: 4, reps: 10, weight: 40 }],
          today: []
        }
      ]
    },
    {
      id: 2,
      groupName: 'Leg Day',
      group: [
        {
          id: 1,
          name: 'Leg Press',
          last: [{ sets: 4, reps: 10, weight: 200 }],
          today: []
        },
        {
          id: 2,
          name: 'Seated Leg Curls',
          last: [
            { sets: 3, reps: 12, weight: 80 },
            { sets: 4, reps: 10, weight: 85 }
          ],
          today: [{ sets: 3, reps: 12, weight: 80 }]
        },
        {
          id: 3,
          name: 'Calf Press',
          last: [{ sets: 5, reps: 15, weight: 100 }],
          today: []
        }
      ]
    }
  ]

  return (
    <div className={`${ROOT_CN}__container`}>
      💪
      <div className={`${ROOT_CN}__header`}>
        <div className={`${ROOT_CN}__title`}>Workout Groups&nbsp;</div>

        <button onClick={() => setModalOpen(true)}>
          <span className={`${ROOT_CN}__add-icon`}>+</span>
        </button>
      </div>
      <AddWorkoutGroupModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {lists.map((list) => {
        return (
          <WorkoutList
            items={list.group}
            key={list.id}
            groupName={list.groupName}
          />
        )
      })}
    </div>
  )
}

export default WorkoutView
