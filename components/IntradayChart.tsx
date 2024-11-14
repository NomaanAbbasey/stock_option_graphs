import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IntradayChartProps {
    symbol: string;
    apiKey: string;
}

const IntradayChart: React.FC<IntradayChartProps> = ({ symbol, apiKey }) => {
    const [priceType, setPriceType] = useState<string>('close');
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!symbol) return;
            setLoading(true); // Start loading

            try {
                const response = await axios.get(`https://www.alphavantage.co/query`, {
                    params: {
                        function: 'TIME_SERIES_INTRADAY',
                        symbol: symbol,
                        interval: '60min',
                        apikey: apiKey,
                    },
                });
                
                console.log(response.data)

                const timeSeries = response.data['Time Series (60min)'];
                if (timeSeries) {
                    // Retrieve data based on selected priceType
                    const labels = Object.keys(timeSeries).reverse(); // Dates for x-axis
                    const data = labels.map((timestamp) => parseFloat(timeSeries[timestamp][`${priceType === 'close' ? '4' : priceType === 'open' ? '1' : priceType === 'high' ? '2' : '3'}. ${priceType}`]));

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: `${symbol} ${priceType} Price`,
                                data,
                                fill: false,
                                borderColor: 'blue',
                                tension: 0.1,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching intraday data:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, [symbol, priceType, apiKey]);

    return (
        <div>
            <h2>{symbol} Intraday Prices</h2>

            <label htmlFor="priceTypeSelect">Select Price Type:</label>
            <select
                id="priceTypeSelect"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                style={{ marginLeft: '10px', marginBottom: '20px' }}
            >
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="close">Close</option>
            </select>

            {/* Display loading message if fetching data */}
            {loading ? <p>Loading data...</p> : <Line data={chartData} options={{ responsive: true }} />}
        </div>
    );
};

export default IntradayChart;