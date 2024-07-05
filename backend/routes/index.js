const express = require('express');
const router = express.Router();
const readingsController = require('../controllers/readingsController');
const userController = require('../controllers/userController');

// Reading routes
router.get('/readings', userController.verifyToken, readingsController.getAllReadings);
router.post('/readings', userController.verifyToken, readingsController.createReading);
router.delete('/readings', userController.verifyToken, readingsController.clearReadings); // Corrected line

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
