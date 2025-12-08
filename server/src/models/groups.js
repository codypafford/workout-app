// models/Group.js
import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  exerciseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }], // array of exercise ObjectIds
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema, 'Groups');

export default Group;
