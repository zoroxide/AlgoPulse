const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const generalRoutes = require('./routes/generalRoutes');
const errorHandler = require('./middlewares/errorHandler');
const compilerRoutes = require('./routes/compilerRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const fightRoutes = require('./routes/fightRoutes');

require('dotenv').config();

const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));


app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.use('/api', generalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/compile', compilerRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/fights', fightRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));