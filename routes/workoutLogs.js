/**
 * @swagger
 * tags:
 *   - name: workoutLogs
 *     description: API for managing workoutLogs
 */

import express from 'express';
import validator from 'validator';


import {
    create,         //create - initializes a workoutLog and adds it to the database

    getAll,         //getAll - gets all logs

    getById,        //getById - get a log with a given id

    getByUser,      //getByUser - get all logs for a given userId

    getByWorkout,   //getByWorkout - get all logs for a given workoutId

    getByDate,      //getByDate - get all logs for a given date

    filterLogs,     //TODO filterLogs - get all logs through one or many parameters (userId, workoutId, date)

    deleteLog,      //deleteLog - removes a log from the database

    updateLog,      //updateLog - updates a log with new log information

    addExercise,    //addExercise - adds an exerciseLog(exercise completed during workout) to the workoutLog

    removeExercise  //removeExercise - removes exerciseLog from the workoutLog(used for testing purposes)

} from '../data/workoutLogs.js';


const router = express.Router();

/**
 * @swagger
 * /workoutLogs:
 *   post:
 *     summary: Creates a new workoutLog
 *     tags:
 *       - workoutLogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               workoutId:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */

//route to create a workoutlog - userId, workoutId, date passed through req.body
router.post('/', async (req, res) => {
    let { userId, workoutId, date } = req.body;

    try{

        userId = isValidId(userId);
        workoutId = isValidId(workoutId);
        date = isValidDate(date);

    }
    catch(e){
        return res.status(400).json({error: 'Error: workoutLogs route: POST / : ' + e});
    }

    try{
        const log = await create(userId, workoutId, date);
        
        if(log) {
            return res.status(201).json(log);
        }
        else{
            throw new Error('Failed to create user');
        }

    }
    catch (e){
        return res.status(500).json({error: 'Error: workoutLogs route: POST / : ' + e});
    }

});



/**
 * @swagger
 * /workoutLogs/{id}: 
 *   delete:
 *     summary: Delete a workoutLog by ID
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workoutLog ID
 *     responses:
 *       200:
 *         description: workoutLog deleted successfully
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Server error
 */

//route to delete a workoutlog - id passed in request
router.delete('/:id', async (req, res) => {
    
    let id = req.params.id;

    try {

        id = isValidId(id);

    }
    catch(e) {

        return res.status(400).json({ error: 'Error: workoutLogs route: DELETE /{id} : ' + e});

    }

    try {
        const deletedLog = await deleteLog(workoutId);

        res.status(200).json({ message: deletedLog });
    }
    catch(e){

        res.status(500).json({error: 'Error: workoutLogs route: DELETE /{id} : ' + e});
    }
  });

  /**
 * @swagger
 * /workoutLogs:
 *   get:
 *     summary: Get all workoutLogs
 *     tags:
 *       - workoutLogs
 *     responses:
 *       200:
 *         description: Array of workoutLogs
 *       500:
 *         description: server error
 */


//route to return all workoutlogs
router.get('/', async (req, res) => {

  try{

    const logs = await getAll();

    res.status(200).json(logs);

  }
  catch(e){

    res.status(500).json({error: 'Error: workoutLogs route: GET / : ' + e});

  }
});

/**
 * @swagger
 * /workoutLogs/{id}:
 *   get:
 *     summary: Get a workoutLog by ID
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workoutLog ID
 *     responses:
 *       200:
 *         description: workoutLogs array object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */

//route to return all workoutlogs with _id = id - id passed through request
router.get('/:id', async (req, res) => {
    
    let id = req.params.id;

    try{

        id = isValidId(id);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: GET /{id} : ' + e});

    }

    try{
        const log = await getById(id);

        res.status(200).json(log);
    }
    catch(e){

        res.status(500).json({error: 'Error: workoutLogs route: GET /{id} : ' + e});

    }
});

/**
 * @swagger
 * /workoutLogs/user/{id}:
 *   get:
 *     summary: Get workoutLogs by userId
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's id
 *     responses:
 *       200:
 *         description: workoutLogs array object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */

//route to return all workoutlogs with userId = id - id passed through request
router.get('/user/:id', async (req, res) => {
    
    let id = req.params.id;

    try{

        id = isValidId(id);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: GET /user/{id} : ' + e});

    }

    try{
        const log = await getByUser(id);

        res.status(200).json(log);
    }
    catch(e){

        res.status(500).json({error: 'Error: workoutLogs route: GET /user/{id} : ' + e});

    }
});

/**
 * @swagger
 * /workoutLogs/workout/{id}:
 *   get:
 *     summary: Get workoutLogs by workoutId
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout's id
 *     responses:
 *       200:
 *         description: workoutLogs array object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */

//route to return all workoutlogs with workoutId = id - id passed through request
router.get('/workout/:id', async (req, res) => {
    
    let id = req.params.id;

    try{

        id = isValidId(id);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: GET /workout/{id} : ' + e});

    }

    try{
        const log = await getByWorkout(id);

        res.status(200).json(log);
    }
    catch(e){

        res.status(500).json({error: 'Error: workoutLogs route: GET /workout/{id} : ' + e});

    }
});

/**
 * @swagger
 * /workoutLogs/date/{id}:
 *   get:
 *     summary: Get workoutLogs by date
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The date
 *     responses:
 *       200:
 *         description: workoutLogs array object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */

//route to return all workoutlogs with date = date - date passed through request
router.get('/date/:date', async (req, res) => {
    
    let date = req.params.date;

    try{

        date = isValidDate(date);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: GET /date/{id} : ' + e});

    }

    try{
        const log = await getByDate(date);

        res.status(200).json(log);
    }
    catch(e){

        res.status(500).json({error: 'Error: workoutLogs route: GET /date/{id} : ' + e});

    }
});


/**
 * @swagger
 * /workoutLogs/{id}:
 *   put:
 *     summary: Update a workoutLog
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               workoutId:
 *                 type: string
 *               date:
 *                 type: string
 *               exerciseLogs:
 *                 type: Object
 *                 properties:
 *                   exerciseId: 
 *                     type: ObjectId, 
                     name: 
                       type: String, 
                     sets: 
                       type: Number,
                     reps: 
                       type: Number,
                     notes: 
                       type: String
 *     responses:
 *       200:
 *         description: workoutLogs array object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 **/

//route to return all workoutlogs filtered by combination of  { userId, workoutId, date } - passed through request body
router.get('/filter', async (req, res) => {
    
    let { userId, workoutId, date } = req.body;

    try{

        userId = isValidId(userId);
        workoutId = isValidId(workoutId);
        date = isValidId(date);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: GET /filter/{id} : ' + e});

    }

    try{
        const log = await filterLogs(userId, workoutId, date);

        res.status(200).json(log);
    }
    catch(e){

        res.status(500).json({error: 'Error: workoutLogs route: GET /filter/{id} : ' + e});

    }
});

/**
 * @swagger
 * /workoutLogs/{id}:
 *   put:
 *     summary: Update a workoutLog
 *     tags:
 *       - workoutLogs
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
 *               userId:
 *                 type: string
 *               workoutId:
 *                 type: string
 *               date:
 *                 type: string
 *               exerciseLogs:
 *                 type: Object
 *                 properties:
 *                   exerciseId: 
 *                     type: ObjectId, 
                     name: 
                       type: String, 
                     sets: 
                       type: Number,
                     reps: 
                       type: Number,
                     notes: 
                       type: String
 *     responses:
 *       200:
 *         description: workoutLogs array object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */

//updates a workoutlog with id passed through request and { userId, workoutId, date, exerciseLogs } passed through request body
router.put('/:id', async (req, res) => {
    let id = req.params.id;
    let { userId, workoutId, date, exerciseLogs } = req.body;

    try{

        id = isValidId(id);
        userId = isValidId(userId);
        workoutId = isValidId(workoutId);
        date = isValidDate(date);
        exerciseLogs = isValidExerciseLog(exerciseLogs);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: PUT /{id} : ' + e});

    }

    try{

        const log = await updateLog(id, userId, workoutId, date, exerciseLogs);
        res.status(200).json(log);

    }
    catch(e){
        res.status(500).json({error: 'Error: workoutLogs route: PUT /{id} : ' + e});
    }

});


/**
 * @swagger
 * /addExercise/{id}:
 *   put:
 *     summary: add exercise to a workoutLog
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workoutLog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exerciseLogs:
 *                 type: Object
 *                 properties:
 *                  exerciseId: ObjectId, 
                    name: String, 
                    sets: Number,
                    reps: Number,
                    notes: String
 *                
 *     responses:
 *       200:
 *         description: workoutLog object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */
//add exercise to workoutlog with id passed through request and exerciselogs passed through request.body
router.put('/addExercise/:id', async (req, res) => {
    let id = req.params.id;
    let { exerciseLogs } = req.body;

    try{

        id = isValidId(id);
        exerciseLogs = isValidExerciseLog(exerciseLogs);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: PUT /addExercise/{id} : ' + e});

    }

    try{

        const log = await addExercise(id, exerciseLogs);
        res.status(200).json(log);

    }
    catch(e){
        res.status(500).json({error: 'Error: workoutLogs route: PUT /addExercise/{id} : ' + e});
    }

});

/**
 * @swagger
 * /removeExercise/{id}:
 *   put:
 *     summary: remove exercise to a workoutLog
 *     tags:
 *       - workoutLogs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workoutLog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *               exerciseLogs:
 *                 type: Object
 *     responses:
 *       200:
 *         description: workoutLogs object
 *       400:
 *         description: Id is invalid
 *       500:
 *         description: server Error
 */
//remove exercise from workoutlog with id passed through request and exerciselogs passed through request.body
router.put('/removeExercise/:id', async (req, res) => {
    let id = req.params.id;
    let { exerciseLogs } = req.body;

    try{

        id = isValidId(id);
        exerciseLogs = isValidExerciseLog(exerciseLogs);

    }
    catch(e){

        return res.status(400).json({error: 'Error: workoutLogs route: PUT removeExercise/{id} : ' + e});

    }

    try{

        const log = await removeExercise(id, exerciseLogs);
        res.status(200).json(log);

    }
    catch(e){
        res.status(500).json({error: 'Error: workoutLogs route: PUT removeExercise/{id} : ' + e});
    }

});

//checks to make sure that ObjectIds exist and follow mongoId conventions
const isValidId = (id) => { 

    if (!id) throw new Error('isValidId: must provide an id');

    if(typeof id !== 'string') throw new Error('isValidId: id must be of type string');

    if (id.trim().length === 0) throw new Error('isValidId: must not provide an empty id string');

    id = id.trim();

    if (!validator.isMongoId(id)) throw new Error('isValidId: must provide a valid id.');

    return id;
};

//checks to make sure that a date exists is valid
const isValidDate = (date) => {

    if (!date) throw new Error('isValidDate: must provide a date');

    const _d = new Date(Date.parse(date));

    if(!validator.isDate(_d)) throw new Error('isValidDate: must provide a valid date');

    return date;
}

//check exerciseLog array for type and element validity
const isValidExerciseLog = (log) => {
    if (log.length !== 0){
        for (i of user.workoutLogs){

            //check exerciseLog id
            i.exerciseId = isValidId(i.exerciseId);

            //check exerciseLog name
            if(!i.name) throw new Error('isValidExerciseLog: exerciseLog must have valid name and be of type string');
            if(typeof i.name !== 'string') throw new Error('isValidExerciseLog: exerciseLog must be of type string');
            if(i.name.trim().length === 0) throw new Error('isValidExerciseLog: exerciseLog must not be empty');
            i.name = i.name.trim();
            
            //check exerciseLog sets and reps as non-zero numbers
            if(!sets || !reps) throw new Error('isValidExerciseLog: sets and reps must be valid numbers');
            if(typeof i.sets !== 'number' || typeof i.reps !== 'number') throw new Error('isValidExerciseLog: sets and reps must be valid numbers');
            if(i.sets < 0 || i.reps < 0) throw new Error('isValidExerciseLog: sets and reps must be non-zero numbers');
            
            //check that notes are of type string. They can be empty notes.
            if(typeof notes !== 'string') throw new Error('isValidExerciseLog: notes must be of type string');
        }
    }
    return log;
}

export default router;
