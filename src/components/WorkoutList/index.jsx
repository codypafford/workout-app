import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddWorkoutModal from '../../Modals/AddWorkout'
import './style.css'

const WorkoutList = ({ items, groupName }) => {
  const ROOT_CN = 'workout-list'
  const [groupExpanded, setGroupExpanded] = useState(false)
  const [itemExpanded, setItemExpanded] = useState({}) // track per-item expansion
  const [modalOpen, setModalOpen] = useState(false)

  const toggleGroup = () => setGroupExpanded((prev) => !prev)

  const toggleItem = (id) => {
    setItemExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleImageUpload = (e, item) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      item.image = reader.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={ROOT_CN}>
      <div className={`${ROOT_CN}__header`}>
        <div
          className={`${ROOT_CN}__col ${ROOT_CN}__col--name`}
          onClick={toggleGroup}
        >
          {groupName}
        </div>

        <div
          className={`${ROOT_CN}__col ${ROOT_CN}__col--arrow`}
          onClick={toggleGroup}
        >
          {groupExpanded ? '▾' : '▸'}
        </div>
      </div>

      <div className={`${ROOT_CN}__body`}>
        <div className={`${ROOT_CN}__meta`}>
          <button onClick={() => setModalOpen(true)}>+ Add Workout</button>
          <button>Archive</button>
          <button>Delete</button>
        </div>

        {items.map((item) => {
          const isExpanded = groupExpanded || itemExpanded[item.id]

          return (
            <div key={item.id} className={`${ROOT_CN}__item-container`}>
              <AddWorkoutModal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
              />

              {/* Main Row */}
              <div className={`${ROOT_CN}__row`}>
                <div
                  className={`${ROOT_CN}__col ${ROOT_CN}__col--name`}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.name}
                </div>

                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--thumb`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt='thumb'
                      className={`${ROOT_CN}__thumb`}
                    />
                  ) : (
                    <>
                      <button
                        className={`${ROOT_CN}__add-thumb-btn`}
                        onClick={() =>
                          document
                            .getElementById(`img-input-${item.id}`)
                            .click()
                        }
                      >
                        +
                      </button>
                      <input
                        id={`img-input-${item.id}`}
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e, item)}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Extra Section */}
              {isExpanded && (
                <div className={`${ROOT_CN}__extra`}>
                  <div className={`${ROOT_CN}__extra-last`}>
                    <label className={`${ROOT_CN}__label`}>Last Time:</label>
                    <div className={`${ROOT_CN}__value`}>
                      {item.last && item.last.length > 0
                        ? item.last.map((entry, index) => (
                            <div key={index}>
                              {entry.sets} x {entry.reps} @ {entry.weight} lbs
                            </div>
                          ))
                        : 'No history yet'}
                    </div>
                  </div>

                  <div className={`${ROOT_CN}__extra-last`}>
                    <label className={`${ROOT_CN}__label`}>Today:</label>
                    <div className={`${ROOT_CN}__value`}>
                      {item.today && item.today.length > 0
                        ? item.today.map((entry, index) => (
                            <div key={index}>
                              {entry.sets} x {entry.reps} @ {entry.weight} lbs
                            </div>
                          ))
                        : 'No history yet'}
                    </div>
                  </div>

                  <div className={`${ROOT_CN}__extra-today`}>
                    <div className={`${ROOT_CN}__inputs`}>
                      <input
                        type='number'
                        placeholder='Sets'
                        className={`${ROOT_CN}__input`}
                      />
                      <input
                        type='number'
                        placeholder='Reps'
                        className={`${ROOT_CN}__input`}
                      />
                      <input
                        type='number'
                        placeholder='Weight (lbs)'
                        className={`${ROOT_CN}__input`}
                      />
                    </div>
                  </div>

                  <div className={`${ROOT_CN}__extra-notes`}>
                    <label className={`${ROOT_CN}__label`}>Notes:</label>
                    <br />
                    <textarea
                      className={`${ROOT_CN}__textarea`}
                      placeholder='Optional notes...'
                    />
                  </div>

                  <div className={`${ROOT_CN}__meta`}>
                    <Link
                      to={`/exercise/${item.id}`}
                      className='workout-list__view-link'
                    >
                      View All Progress
                    </Link>
                    <button>Save Today's Workout</button>
                    <button>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkoutList
