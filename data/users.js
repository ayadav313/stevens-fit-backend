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

//checks the validity of a username-password combination
const checkUserByUsername = async (username, password) => {
  if(!validator.isAlphanumeric(username) || validator.isEmpty(username)){
    throw new Error("Invalid username");
  }
  if(validator.isEmpty(password)){
    throw new Error("Invalid password");
  }
  const possibleUsers = await users.find({username: username}).toArray();
  if(!possibleUsers || possibleUsers.length < 1){
    throw new Error("User not found");
  }
  const user = possibleUsers[0];
  const isValid = await bcrypt.compare(password, user.password);
  if(!isValid){
    throw new Error("Incorrect password");
  }
}

//checks the validity of a email-password combination
const checkUserByEmail = async (email, password) => {
  if(!validator.isEmail(email)){
    throw new Error("Invalid email");
  }
  if(validator.isEmpty(password)){
    throw new Error("Invalid password");
  }
  const usersCollection = await users();
  const possibleUsers = await usersCollection.find({email: email}).toArray();
  if(!possibleUsers || possibleUsers.length < 1){
    throw new Error("User not found");
  }
  const user = possibleUsers[0];

  const isValid = await bcrypt.compare(password, user.password);
  if(!isValid){
    throw new Error("Incorrect password");
  }
  
  return user;
}

const deleteUser = async (userId) => {
    // Validate input
    if (!validator.isMongoId(userId)) { throw new Error('Invalid user ID'); }

    const usersCollection = await users();
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) { throw new Error('Failed to delete user'); }

    return true;
};  


const getUserById = async (userId) => {
  if(!validator.isMongoId(userId)){
    throw new Error("Invalid user ID");
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({_id: new ObjectId(userId)});
  if(!user){
    throw new Error("User with ID " + userId + " does not exist");
  }
  //constructing output object
  const output = {
    username: user.username,
    email: user.email,
    workouts: user.workouts,
    workoutLogs: user.workoutLogs
  };
  return output;
};

const getUserByUsername = async (username) => {
  //checking if usernameis valid
  if(!validator.isAlphanumeric(username) || validator.isEmpty(username)){
    throw new Error("Invalid username");
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({username: username});
  if(!user){ //if user does not exist
    throw new Error("User with username " + username + " does not exist");
  }
  //constructing output object
  const output = {
    username: user.username,
    email: user.email,
    workouts: user.workouts,
    workoutLogs: user.workoutLogs
  };
  return output;
};

const updateUser = async (userId, updatedUser) => {
  if(!validator.isMongoId(userId)){
    throw new Error("Invalid user ID");
  }
  if(!isUser(updatedUser)){ //probably should write something to validate if the parameter is a user-type object
    throw new Error("Invalid user object provided");
  }

  const usersCollection = await users();
  const response = await usersCollection.updateOne(
    {_id: new ObjectId(userId)},
    {$set: updatedUser}
  );

  if(!response.acknowledged){
    throw new Error("Failed to update user");
  }
};

const getAllUsers = async () => {
  const usersCollection = await users();
  const allUsers = await usersCollection.find().toArray();
  return allUsers;
};



const isUser = (user) => {

  //checking user exists and is of correct type 
  if (!user) return false;
  if (typeof user !== 'object') return false;

  //checking username
  if(!user.username) return false;
  if (validator.isEmpty(user.username) || !validator.isAlphanumeric(user.username)) return false;

  //checking password
  if(!user.password) return false;
  if (validator.isEmpty(user.password)) return false;
  
  //checking email
  if(!user.email) return false;
  if (!validator.isEmail(user.email)) return false;

  //check workouts array for type and element validity
  if (!Array.isArray(user.workouts) || !Array.isArray(user.workoutLogs)) return false;
  if (user.workouts.length !== 0) {
      for (i of user.workouts){
          if (!validator.isMongoId(i)) return false;
      }
  }
  
  //check workoutLogs array for type and element validity
  if (user.workoutLogs.length !== 0){
      for (i of user.workoutLogs){
        if (!validator.isMongoId(i)) return false;
      }
  }
  return true;
}

export {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  checkUserByUsername,
  checkUserByEmail
};
