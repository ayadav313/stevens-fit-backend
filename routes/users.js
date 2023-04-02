// routes/users.js

import express from 'express';
import validator from 'validator';


import {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
} from '../data/users.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) { return res.status(400).json({ message: 'All fields are required' }); }

        // Validate input
        if (!validator.isAlphanumeric(username) || validator.isEmpty(username)) { return res.status(400).json({ message: 'Invalid username' }); }

        if (validator.isEmpty(password)) { return res.status(400).json({ message: 'Invalid password' }); }

        if (!validator.isEmail(email)) { return res.status(400).json({ message: 'Invalid email' });}

        await createUser(username, password, email);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!validator.isMongoId(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      await deleteUser(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/', async (req, res) => {
  // Implement the route to get all users
  res.json("hi");
});

router.get('/:id', async (req, res) => {
  // Implement the route to get a user by ID
});

router.get('/username/:username', async (req, res) => {
  // Implement the route to get a user by username
});

router.put('/:id', async (req, res) => {
  // Implement the route to update a user
});



export default router;
