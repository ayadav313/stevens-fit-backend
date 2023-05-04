import { workouts } from "../config/mongoCollections";
import validator from "validator";
import {ObjectId} from 'mongodb';

// Scheme for workouts
// {
//     "_id": ObjectId, Id of workout
//     "name": String,
//     "creator": ObjectId, Id of user who created workout
//     "exercises": List of exercise objects
//     {
//          "exerciseId": ObjectId Id of workout, from exercises collection
//          "sets": Number,
//          "reps": Number,
//          "additionalDetails": String,
//      }
// }

const workoutMethods = {
//creates and adds exercise object
//additional properties in exercise objects are ignored
async create(name, creator, exercises){
    if(validator.isEmpty(name)){
        throw new Error("Invalid workout name.");
    }
    if(validator.isEmpty(creator)){
        throw new Error("Invalid creator id.");
    }
    if(validator.isEmpty(exercises) || !Array.isArray(exercises) || exercises.length < 1){
        throw new Error("Invalid excerise list.");
    }
    
    let filteredList = [];
    for(let i = 0; i < exercises.length; i++){
        const currentExercise = exercises[i];
        this.validateExercise(currentExercise);
        
        let filteredExercise = {};
        filteredExercise.exerciseId = currentExercise.exerciseId;
        filteredExercise.sets = currentExercise.sets;
        filteredExercise.reps = currentExercise.reps;
        if(!validator.isEmpty(currentExercise.additionalDetails != null)){
            filteredExercise.additionalDetails = currentExercise.additionalDetails;
        }
        filteredList.push(filteredExercise);
    }
    const workout = {
        name: name,
        creator: creator,
        exercises: filteredList
    };
    const workoutsCollection = await workouts();
    const result = await workoutsCollection.insertOne(workout);
    if(result.insertedCount === 0){
        throw new Error("Failed to add workout");
    }
    

},
//validates an exercise object
//exercise object must contain the following properties:
//exerciseId: that is a valid ID from the exercises collection
//sets: number that is a positive integer
//reps: number that is a positive integer
validateExercise(exercise){
    const keys = exercise.keys();
    if(!keys.includes("exerciseId")){
        throw new Error("Invalid Exercise Object: does not contain field 'exerciseId'");
    }
    if(!keys.includes("sets")){
        throw new Error("Invalid Exercise Object: does not contain field 'sets'");
    }
    if(!keys.includes("reps")){
        throw new Error("Invalid Exercise Object: does not contain field 'reps'");
    }
    if(!validator.isMongoId(exercise.exerciseId)){
        throw new Error("Invalid Exercise Object: Invalid exercise ID.");
    }
    if(!validator.isInt(exercise.sets) || exercise.sets < 1){
        throw new Error("Invalid Exercise Object: Invalid set number.");
    }
    if(!validator.isInt(exercise.reps) || exercise.reps < 1){
        throw new Error("Invalid Exercise Object: Invalid rep number.");
    }
}

}

export default workoutMethods;
