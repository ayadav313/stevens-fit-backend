import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import exerciseMethods from '../data/exercises.js';

const seedDatabase = async () => {
  const db = await dbConnection();

  try {
    await db.dropDatabase();
    console.log('Seeding database from csv');

    const exercises = [];

    fs.createReadStream('data.csv')
      .pipe(csvParser())
      .on('data', (row) => {
        const { name, target, bodyPart, equipment, gifUrl } = row;
        exercises.push({ name, target, bodyPart, equipment, gifUrl });
      })
      .on('end', async () => {
        try {
          for (const exercise of exercises) {
            const addedID = await exerciseMethods.create(exercise.name, exercise.target, exercise.bodyPart, exercise.equipment, exercise.gifUrl);
            console.log(`Added exercise "${addedID}" succesfully!`);
          }
          console.log('Done seeding database');
          closeConnection();
        } catch (error) {
          console.log(`Error adding exercises to database: ${error.message}`);
          await closeConnection();
        }
      });
  } catch (error) {
    console.log(`Error seeding database: ${error.message}`);
    await closeConnection();
  }
};

seedDatabase();
