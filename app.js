// app.js

import express from 'express';
import userRoutes from './routes/users.js';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

