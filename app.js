import express from 'express';
import userRoutes from './routes/users.js';
import swaggerMiddleware from './swagger.js';

const app = express();

// Mount Swagger middleware on /api-docs route
swaggerMiddleware(app);

// Configure application to parse JSON data in request bodies
app.use(express.json());

// Mount userRoutes middleware on /api/users route
app.use('/api/users', userRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
