const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const generalRoutes = require('./src/routes/generalRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const compilerRoutes = require('./src/routes/compilerRoutes');
const submissionRoutes = require('./src/routes/submissionRoutes');
const fightRoutes = require('./src/routes/fightRoutes');


require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use('/api', generalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/fights', fightRoutes); 

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));