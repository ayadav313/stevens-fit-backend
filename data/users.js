// data/users.js

import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { ObjectId } from 'mongodb';


const createUser = async (username, password, email) => {
    // Validate input
    if (!validator.isAlphanumeric(username) || validator.isEmpty(username)) { throw new Error('Invalid username'); }

    if (validator.isEmpty(password)) { throw new Error('Invalid password'); }

    if (!validator.isEmail(email)) { throw new Error('Invalid email'); }

    const usersCollection = await users();

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username: username });
    if (existingUser) { throw new Error('Username already exists'); }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construct the user object according to the schema
    const newUser = {
        username: username,
        password: hashedPassword,
        email: email,
        workouts: [],
        workoutLogs: [],
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.insertedCount === 0) { throw new Error('Failed to add user'); }

    return true;
};

const deleteUser = async (userId) => {
    // Validate input
    if (!validator.isMongoId(userId)) { throw new Error('Invalid user ID'); }

    const usersCollection = await users();
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) { throw new Error('Failed to delete user'); }

    return true;
};  


const getUserById = async (userId) => {
  // Implement logic to retrieve a user by ID here
};

const getUserByUsername = async (username) => {
  // Implement logic to retrieve a user by username here
};

const updateUser = async (userId, updatedUser) => {
  // Implement user update logic here
};

const getAllUsers = async () => {
  const usersCollection = await users();
  const allUsers = await usersCollection.find().toArray();
  return allUsers;
};

export {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
};
