const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Define allowed origins (your frontend domain)
const allowedOrigins = ['https://cheatheon.vercel.app/', 'http://localhost:3000']; // Add your frontend URLs here

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS'), false); // Reject request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const contestRoutes = require('./routes/contests');
const questionRoutes = require('./routes/questions');

app.use('/api/contests', contestRoutes);
app.use('/api/questions', questionRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
