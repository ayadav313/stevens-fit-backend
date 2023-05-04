import { workouts } from "../config/mongoCollections";
import validator from "validator";
import {ObjectId} from 'mongodb';

// Scheme for workouts
// {
//     "_id": ObjectId,
//     "name": String,
//     "creator": ObjectId,
//     "exercises": List of exercise objects
//     {
//          "exerciseId": ObjectId
//          "sets": Number,
//          "reps": Number,
//          "additionalDetails": String,
//      }
// }


