const db = require('../database');

exports.getAllReadings = (req, res) => {
    db.all("SELECT * FROM readings ORDER BY timestamp", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

exports.createReading = (req, res) => {
    const { temperature, humidity } = req.body;
    const timestamp = new Date().toISOString();

    const stmt = db.prepare("INSERT INTO readings (temperature, humidity, timestamp) VALUES (?, ?, ?)");
    stmt.run(temperature, humidity, timestamp, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
};


exports.clearReadings = (req, res) => {
    db.run("DELETE FROM readings", (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(204).send();
    });
};
