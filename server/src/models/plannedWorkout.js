// models/PlannedWorkout.js
import mongoose from 'mongoose'

const plannedWorkoutSchema = new mongoose.Schema(
  {
    exerciseIds: { type: Array, required: true }
  },
  { timestamps: true }
)

const Exercise = mongoose.model('PlannedWorkout', plannedWorkoutSchema, 'PlannedWorkout')

export default Exercise
