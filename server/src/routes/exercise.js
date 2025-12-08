// routes/exerciseRoutes.js
import { Router } from 'express';
import Exercise from '../models/exercises.js';
import Group from '../models/groups.js'

const router = Router();

router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find({ isActive: true }).lean();
    res.json(exercises);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper to add exercise ID to a group
const addExerciseToGroup = async (exerciseId, groupId) => {
  if (!groupId) return;

  await Group.findByIdAndUpdate(
    groupId,
    { $addToSet: { exerciseIds: exerciseId } }, // avoids duplicates
    { new: true }
  );
};

// POST /api/exercises
router.post('/', async (req, res) => {
  try {
    const { name, photo, isNew, groupId, id: existingExerciseId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Exercise name is required' });
    }

    let exerciseId;

    if (isNew) {
      // Create a new exercise
      const newExercise = new Exercise({
        name,
        photo: photo || '',
        isActive: true
      });

      const savedExercise = await newExercise.save();
      exerciseId = savedExercise._id;
    } else {
      if (!existingExerciseId) {
        return res.status(400).json({ message: 'Existing exercise ID is required' });
      }
      exerciseId = existingExerciseId;
    }

    // Add exercise to group if groupId provided
    if (groupId) {
      await addExerciseToGroup(exerciseId, groupId);
    }

    res.status(201).json({ id: exerciseId, name, isNew });
  } catch (err) {
    console.error('Error adding exercise:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
