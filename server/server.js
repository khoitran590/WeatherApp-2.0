// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/weatherSearches'; 
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the search schema and model
const searchSchema = new mongoose.Schema({
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Search = mongoose.model('Search', searchSchema);

// Route to save a search
app.post('/api/search', (req, res) => {
  const { location } = req.body;
  console.log('Location received:', location); // Log to check data being received
  
  const newSearch = new Search({ location });
  newSearch.save()
    .then(() => {
      console.log('Search saved to database');
      res.status(201).json({ message: 'Search saved!' });
    })
    .catch(err => {
      console.error('Failed to save search:', err);
      res.status(500).json({ error: 'Failed to save search' });
    });
});
// Route to get recent searches
app.get('/api/searches', (req, res) => {
  Search.find()
    .sort({ timestamp: -1 }) // Sort by most recent
    .limit(10) // Get the last 10 searches
    .then(searches => res.status(200).json(searches))
    .catch(err => res.status(500).json({ error: 'Failed to fetch searches' }));
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));