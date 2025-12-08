// models/Exercise.js
import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema, 'Exercises');

export default Exercise;
