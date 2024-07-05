import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = async (username, password) => {
        const userData = await authService.login(username, password);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } else {
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
