import { useState } from 'react';
import '../style.css';

const AddWorkoutGroupModal = ({ show, onClose, onSubmit }) => {
  const [groupName, setGroupName] = useState('');

  if (!show) return null;

  const handleSubmit = () => {
    if (!groupName.trim()) return; // optionally prevent empty names
    onSubmit(groupName); // pass the name back to parent
    setGroupName(''); // reset input
    onClose()
  };

  const handleClose = () => {
    setGroupName(''); // reset input
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Workout Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="close" onClick={handleClose}>Cancel</button>
          <button className="confirm" onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutGroupModal;
