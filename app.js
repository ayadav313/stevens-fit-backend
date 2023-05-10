import express from 'express';
import swaggerMiddleware from './swagger.js';
import configRoutes from './routes/index.js';
import cors from 'cors';

const app = express();

// Mount Swagger middleware on /api-docs route
swaggerMiddleware(app);

// Configure application to parse JSON data in request bodies
app.use(express.json());
app.use(cors());

// Mount userRoutes middleware on /api/users route
//app.use('/api/users', userRoutes);

configRoutes(app);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
