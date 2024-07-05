import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReadingList = () => {
    const [readings, setReadings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/readings')
            .then(response => {
                setReadings(response.data.data);
            });
    }, []);

    return (
        <div className="reading-list">
            <h2>Temperature and Humidity Readings</h2>
            <ul>
                {readings.map(reading => (
                    <li key={reading.id}>
                        <strong>Time:</strong> {new Date(reading.timestamp).toLocaleString()}<br />
                        <strong>Temperature:</strong> {reading.temperature} °C<br />
                        <strong>Humidity:</strong> {reading.humidity} %
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReadingList;
