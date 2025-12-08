import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddWorkoutModal from '../../Modals/AddWorkout'
import FormData from './FormData'
import './style.css'

const WorkoutList = ({ items, groupName }) => {
  const ROOT_CN = 'workout-list'

  const [expandedItemId, setExpandedItemId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState(null) // new state for image modal

  const toggleItem = (id) => {
    setExpandedItemId((prev) => (prev === id ? null : id))
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
      {/* Group Header */}
      <div className={`${ROOT_CN}__header`}>
        <div className={`${ROOT_CN}__col ${ROOT_CN}__col--name`}>
          {groupName}
        </div>
      </div>

      <div className={`${ROOT_CN}__body`}>
        <div className={`${ROOT_CN}__meta`}>
          <button onClick={() => setModalOpen(true)}>+ Add Workout</button>
        </div>

        {items.map((item) => {
          const isExpanded = expandedItemId === item.id

          return (
            <div key={item.id} className={`${ROOT_CN}__item-container`}>
              <AddWorkoutModal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
              />

              {/* Main Row */}
              <div className={`${ROOT_CN}__row`}>
                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--name`}>
                  <span
                    className={`${ROOT_CN}__expand-name`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.name}&nbsp;
                    <span className={`${ROOT_CN}__arrow`}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </span>
                </div>

                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--link`}>
                  <Link
                    to={`/exercise/${item.id}`}
                    className={`${ROOT_CN}__view-link`}
                  >
                    View All Progress
                  </Link>
                </div>
                <div className={`${ROOT_CN}__col ${ROOT_CN}__col--thumb`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt='thumb'
                      className={`${ROOT_CN}__thumb`}
                      onClick={(e) => {
                        e.stopPropagation() // prevent expanding the row
                        setEnlargedImage(item.image)
                      }}
                    />
                  ) : (
                    <>
                      <button
                        className={`${ROOT_CN}__add-thumb-btn`}
                        onClick={(e) => {
                          e.stopPropagation()
                          document
                            .getElementById(`img-input-${item.id}`)
                            .click()
                        }}
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

              <FormData isExpanded={isExpanded} className={ROOT_CN} item={item}/>

              {/* Image Modal */}
              {enlargedImage && (
                <div
                  className={`${ROOT_CN}__image-modal`}
                  onClick={() => setEnlargedImage(null)}
                >
                  <img
                    src={enlargedImage}
                    alt='Enlarged'
                    className={`${ROOT_CN}__image-modal-content`}
                  />
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
