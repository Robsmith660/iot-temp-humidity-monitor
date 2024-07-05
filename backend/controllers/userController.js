// backend/controllers/userController.js
const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key'; // Replace with your actual secret key

exports.register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
        if (err) {
            res.status(400).json({ error: 'Username already exists' });
            return;
        }
        const token = jwt.sign({ id: this.lastID }, secretKey, { expiresIn: 86400 });
        res.json({ auth: true, token, username });
    });
    stmt.finalize();
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ auth: false, token: null });
            return;
        }
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 });
        res.json({ auth: true, token, username });
    });
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
};
