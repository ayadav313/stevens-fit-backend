/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 */

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

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Creates a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
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

  /**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', async (req, res) => {
  // Implement the route to get all users
  res.json("hi");
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 */
router.get('/:id', async (req, res) => {
  // Implement the route to get a user by ID
});

/**
 * @swagger
 * /user/username/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's username
 *     responses:
 *       200:
 *         description: A user object
 */
router.get('/username/:username', async (req, res) => {
  // Implement the route to get a user by username
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user object
 */
router.put('/:id', async (req, res) => {
  // Implement the route to update a user
});



export default router;
