//routes/index.js

import exerciseRoutes from './exercises.js';
import userRoutes from './users.js';
import workoutLogsRoutes from './workoutLogs.js';

const constructorMethod = (app) => {
  app.use('/exercises', exerciseRoutes);
  app.use('/users', userRoutes);
  app.use('/workoutLogs', workoutLogsRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
