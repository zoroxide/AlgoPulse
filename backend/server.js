const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const generalRoutes = require('./src/routes/generalRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

console.log("MONGO_URL:", process.env.MONGO_URL);


// Database connection
connectDB();

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', generalRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
