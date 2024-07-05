import React, { useEffect, useState, useRef, useContext } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import 'chartjs-adapter-date-fns';

const ChartComponent = () => {
    const { user } = useContext(AuthContext);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/readings', {
                headers: {
                    'x-access-token': user ? user.token : '' // Include the JWT token in the request headers
                }
            });
            const data = response.data.data;

            if (data && data.length > 0) {
                const timestamps = data
                    .map(reading => {
                        const date = new Date(reading.timestamp);
                        console.log("Parsed Date:", date);
                        return isNaN(date.getTime()) ? null : date;
                    })
                    .filter(date => date !== null);

                const temperatures = data.map(reading => reading.temperature);
                const humidities = data.map(reading => reading.humidity);

                setChartData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Temperature (°C)',
                            data: temperatures,
                            borderColor: 'rgba(75,192,192,1)',
                            fill: false,
                        },
                        {
                            label: 'Humidity (%)',
                            data: humidities,
                            borderColor: 'rgba(153,102,255,1)',
                            fill: false,
                        },
                    ],
                });
            }
        } catch (error) {
            console.error('There was an error fetching the readings!', error);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch

        const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => {
            clearInterval(intervalId); // Cleanup interval on component unmount
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [user]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (canvasRef.current) {
            chartRef.current = new Chart(canvasRef.current, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'minute',
                                tooltipFormat: 'PP HH:mm',
                                displayFormats: {
                                    minute: 'HH:mm'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        }
                    }
                },
            });
        }
    }, [chartData]);

    const clearChart = async () => {
        try {
            await axios.delete('http://localhost:3001/api/readings', {
                headers: {
                    'x-access-token': user ? user.token : '' // Include the JWT token in the request headers
                }
            });
            setChartData({ labels: [], datasets: [] });
        } catch (error) {
            console.error('There was an error clearing the readings!', error);
        }
    };

    return (
        <div>
            <h2>Temperature and Humidity Chart</h2>
            <div style={{ height: '400px' }}>
                <canvas ref={canvasRef} />
            </div>
            <button onClick={clearChart}>Clear Chart</button>
        </div>
    );
};

export default ChartComponent;
