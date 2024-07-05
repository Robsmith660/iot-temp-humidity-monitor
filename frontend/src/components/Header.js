import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';
import './App.css';

const App = () => {
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        }
    }, [user, setUser]);

    return (
        <Router>
            <div className="app">
                <nav className="header">
                    <h1>IoT Temperature and Humidity Monitor</h1>
                    <div className="nav-links">
                        {user ? (
                            <>
                                <span>Welcome, {user.username}!</span>
                                <Link to="/home">Home</Link>
                                <Link to="/logout">Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
                        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/home" />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

const Logout = () => {
    const { logout } = useContext(AuthContext);
    useEffect(() => {
        logout();
    }, [logout]);
    return <Navigate to="/login" />;
};

export default App;
