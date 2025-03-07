const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

//middleware
app.use(cors());
app.use(express.json());

//route imports
const fileRoutes = require('./routes/fileRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes');

//apply routes
app.use('/api/files', fileRoutes);
app.use('/api/attendees',attendeeRoutes);

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status:'error',
        message:'Something went wrong',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports =app;