//routes/index.js

import exerciseRoutes from './exercises.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
  app.use('/exercises', exerciseRoutes);
  app.use('/users', userRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
