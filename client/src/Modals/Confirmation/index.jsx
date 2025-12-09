import '../style.css'

const ConfirmationModal = ({ show, onClose, onSubmit, header, bodyText }) => {
  if (!show) return null

  const handleSubmit = () => {
    onSubmit()
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <h2>{header}</h2>
        <span>{bodyText}</span>
        <div className='modal-actions'>
          <br />
          <button className='close' onClick={handleClose}>
            Cancel
          </button>
          <button className='confirm' onClick={handleSubmit}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
