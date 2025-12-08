// models/Log.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  exerciseNameSnapshot: { type: String, required: true }, // store a snapshot in case exercise name changes

  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  groupNameSnapshot: { type: String, required: true }, // store a snapshot in case group name changes

  date: { type: Date, required: true },

  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },

  notes: { type: String, default: '' },
}, { timestamps: true }); // includes createdAt and updatedAt automatically

const Log = mongoose.model('Log', logSchema, 'Logs');

export default Log;
