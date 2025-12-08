import '../style.css';

const AddWorkoutGroupModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Workout Group</h2>
        <input type="text" placeholder="Group Name" />
        <div className="modal-actions">
          <button className="close" onClick={onClose}>Cancel</button>
          <button className="confirm">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutGroupModal;