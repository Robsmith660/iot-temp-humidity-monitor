// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/';

const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'login', { username, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    getCurrentUser,
};

export default authService;
