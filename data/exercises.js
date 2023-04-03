import { exercises } from '../config/mongoCollections.js';
import validator from 'validator';
import {ObjectId} from 'mongodb';

// Scheme for exercise
// {
//     "_id": ObjectId,
//     "name": String,
//     "target": String,
//     "bodyPart": String,
//     "equipment": String,
//     "gifUrl": String,
//    }

//TODO create method

//TODO get exercise by name

//TODO get exercise by id

//TODO get list of exercises by bodyPart

//TODO get list of exercises by equipment

//TODO get list of exercises by target

// Scheme for exercise
// {
//     "_id": ObjectId,
//     "name": String,
//     "target": String,
//     "bodyPart": String,
//     "equipment": String,
//     "gifUrl": String,
// }

const exerciseMethods = {
async create(name, target, bodyPart, equipment, gifUrl) {
    if (validator.isEmpty(name)) {
        throw new Error('Invalid exercise name.');
    }
    if (validator.isEmpty(target)) {
        throw new Error('Invalid exercise target.');
    }
    if (validator.isEmpty(bodyPart)) {
        throw new Error('Invalid exercise body part.');
    }
    if (validator.isEmpty(equipment)) {
        throw new Error('Invalid exercise equipment.');
    }
    if (!validator.isURL(gifUrl)) {
        throw new Error('Invalid exercise gif URL.');
    }
    const newExercise = { name, target, bodyPart, equipment, gifUrl };
    const exercisesCollection = await exercises();
    const result = await exercisesCollection.insertOne(newExercise);
    if (result.insertedCount === 0) { throw new Error('Failed to add exercise'); }
      return name;
    },
  async get(id) {
    if (!validator.isMongoId(id)) {
      throw new Error('Invalid exercise ID.');
    }
    const exercisesCollection = await exercises();
    const exercise = await exercisesCollection.findOne({ _id: ObjectId(id) });
    if (!exercise) {
      throw new Error(`Exercise with ID ${id} not found.`);
    }
    return exercise;
  },

  async getByName(name) {
    if (!validator.isString(name)) {
      throw new Error('Invalid exercise name.');
    }
    const exercisesCollection = await exercises();
    const exercise = await exercisesCollection.findOne({ name });
    if (!exercise) {
      throw new Error(`Exercise with name ${name} not found.`);
    }
    return exercise;
  },

  async getByBodyPart(bodyPart) {
    if (!validator.isString(bodyPart)) {
      throw new Error('Invalid body part.');
    }
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find({ bodyPart }).toArray();
    return exerciseList;
  },

  async getByEquipment(equipment) {
    if (!validator.isString(equipment)) {
      throw new Error('Invalid equipment.');
    }
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find({ equipment }).toArray();
    return exerciseList;
  },

  async getByTarget(target) {
    if (!validator.isString(target)) {
      throw new Error('Invalid target.');
    }
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find({ target }).toArray();
    return exerciseList;
  },

  async getAll() {
    const exercisesCollection = await exercises();
    const exerciseList = await exercisesCollection.find().toArray();
    return exerciseList;
  },
  
};

export default exerciseMethods;

