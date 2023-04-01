import { users } from './config/mongoCollections.js';
import bcrypt from 'bcrypt';

const addUser = async (user) => {
  const usersCollection = await users();

  // Hash the password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Construct the user object according to the schema
  const newUser = {
    username: user.username,
    password: hashedPassword,
    email: user.email,
    workouts: [],
    workoutLogs: [],
  };

  const result = await usersCollection.insertOne(newUser);
  return true;
};

const testUser = {
  username: 'johndoe',
  password: 'password123',
  email: 'johndoe@example.com',
};

addUser(testUser)
  .then((insertedUser) => {
    console.log('User added successfully:', insertedUser);
  })
  .catch((error) => {
    console.error('Error adding user:', error);
  });

const deleteAllUsers = async () => {
    const usersCollection = await users();
    const result = await usersCollection.deleteMany({});
    return result.deletedCount;
};

deleteAllUsers()
.then((deletedCount) => {
    console.log(`Deleted ${deletedCount} users.`);
})
.catch((error) => {
    console.error('Error deleting users:', error);
});