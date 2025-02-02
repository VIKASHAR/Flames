const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// Middleware
const corsOptions = {
    origin: "https://flamesvv.vercel.app", // Ensure this matches your frontend's exact URL
    methods: ["POST", "GET", "OPTIONS"], // Add OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions)); // Apply CORS middleware globally
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB Connection
const mongoURI = 'mongodb+srv://vikash:sajH5tUv9ffAhSXx@cluster0.ra5ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// FLAMES Schema and Model
const flamesSchema = new mongoose.Schema({
    name1: String,
    name2: String,
    result: String,
    createdAt: { type: Date, default: Date.now }
});

const Flames = mongoose.model('Flames', flamesSchema);

// FLAMES Logic (Converted from Java to JavaScript)
const getUniqueCharacterCount = (name1, name2) => {
    let arr = [];
    let arr2 = [];

    for (let i = 0; i < name1.length; i++) {
        arr.push(name1[i]);
    }

    for (let i = 0; i < name2.length; i++) {
        let ch = name2[i];
        if (arr.includes(ch)) {
            arr.splice(arr.indexOf(ch), 1);
        } else {
            arr2.push(ch);
        }
    }

    return arr.length + arr2.length;
};

const getFlamesResult = (remainingLetters) => {
    let flames = ["Friends", "Lovers", "Affection", "Marriage", "Enemies", "Siblings"];
    let index = 0;

    while (flames.length > 1) {
        index = (index + remainingLetters - 1) % flames.length;
        flames.splice(index, 1);
    }

    return flames;
};

// Input Validation Function
const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/; // Allow alphabetic characters and spaces
    return regex.test(name);
};

// Function to remove spaces from names
const removeSpaces = (name) => {
    return name.replace(/\s/g, '');
};

// Handle preflight requests
app.options('/flames', cors(corsOptions)); // Explicitly handle preflight requests for the /flames endpoint

// API Endpoint
app.post('/flames', async (req, res) => {
    try {
        const { name1, name2 } = req.body;

        // Validate input names
        if (!validateName(name1) || !validateName(name2)) {
            return res.status(400).json({ error: 'Names should contain only alphabetic characters and spaces.' });
        }

        // Remove spaces from names before processing
        const name1WithoutSpaces = removeSpaces(name1);
        const name2WithoutSpaces = removeSpaces(name2);

        // Calculate FLAMES result
        const remainingLetters = getUniqueCharacterCount(name1WithoutSpaces.toLowerCase(), name2WithoutSpaces.toLowerCase());
        const result = getFlamesResult(remainingLetters);

        // Save data to MongoDB
        const flamesEntry = new Flames({
            name1,
            name2,
            result: result[0]
        });
        await flamesEntry.save();
        console.log('Data saved to MongoDB:', flamesEntry);

        // Send response with CORS headers
        res.setHeader('Access-Control-Allow-Origin', 'https://flamesvv.vercel.app');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.json({ result });
    } catch (err) {
        console.error('Error in /flames endpoint:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // Export for Vercel deployment
