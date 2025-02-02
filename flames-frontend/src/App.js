import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/flames', { name1, name2 });
            setResult(response.data.result[0]);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <h1>FLAMES Game</h1>
                <p className="subtitle">Discover your relationship status with your loved one!</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Your Crush's Name"
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Calculating...' : 'Find Out'}
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
                {result && (
                    <div className="result">
                        <h2>Your Relationship Status:</h2>
                        <p className="result-text">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;