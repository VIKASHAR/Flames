const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// API Endpoint
app.post('/flames', async (req, res) => {
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
    try {
        const flamesEntry = new Flames({
            name1,
            name2,
            result: result[0]
        });
        await flamesEntry.save();
        console.log('Data saved to MongoDB:', flamesEntry);
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
        return res.status(500).json({ error: 'An error occurred while saving data.' });
    }

    // Send response
    res.json({ result });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});