import express from 'express';
import exerciseMethods from '../data/exercises.js';

const router = express.Router();

// POST /exercises
router.post('/', async (req, res) => {
  try {
    const { name, target, bodyPart, equipment, gifUrl } = req.body;
    const exercise = await exerciseMethods.create(name, target, bodyPart, equipment, gifUrl);
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /exercises
router.get('/', async (req, res) => {
    try {
      const exerciseList = await exerciseMethods.getAll();
      res.json(exerciseList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// GET /exercises/:id
router.get('/:id', async (req, res) => {
  try {
    const exercise = await exerciseMethods.get(req.params.id);
    res.json(exercise);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET /exercises/body-part/:bodyPart
router.get('/body-part/:bodyPart', async (req, res) => {
  try {
    const exerciseList = await exerciseMethods.getByBodyPart(req.params.bodyPart);
    res.json(exerciseList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET /exercises/equipment/:equipment
router.get('/equipment/:equipment', async (req, res) => {
  try {
    const exerciseList = await exerciseMethods.getByEquipment(req.params.equipment);
    res.json(exerciseList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET /exercises/target/:target
router.get('/target/:target', async (req, res) => {
  try {
    const exerciseList = await exerciseMethods.getByTarget(req.params.target);
    res.json(exerciseList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
