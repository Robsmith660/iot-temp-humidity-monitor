const axios = require('axios');

let token = null;

const login = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/login', {
            username: 'testuser', // Use the username you registered
            password: 'testpassword' // Use the password you registered
        });
        token = response.data.token;
        console.log('Logged in successfully, token:', token);
    } catch (error) {
        console.error('Error logging in:', error);
    }
};

const simulateReading = async () => {
    if (!token) {
        console.error('No token available, skipping reading simulation.');
        return;
    }

    const temperature = (Math.random() * 30).toFixed(2); // Random temperature between 0 and 30
    const humidity = (Math.random() * 50 + 50).toFixed(2); // Random humidity between 50 and 100

    try {
        const response = await axios.post('http://localhost:3001/api/readings', { temperature, humidity }, {
            headers: { 'x-access-token': token }
        });
        console.log(`Added reading: Temperature=${temperature}°C, Humidity=${humidity}%`);
    } catch (error) {
        console.error('Error adding reading:', error);
    }
};

// Authenticate and then start simulating readings
login().then(() => {
    setInterval(simulateReading, 5000); // Simulate a reading every 5 seconds
});
