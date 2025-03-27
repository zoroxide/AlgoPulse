import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axiosInstance from '../../utils/axiosInstance';

const AdminDashboard = () => {
    const [lineChartData, setLineChartData] = useState(null);
    const [lineChartOptions, setLineChartOptions] = useState(null);

    useEffect(() => {
        const fetchSubmissionsData = async () => {
            try {
                const response = await axiosInstance.get('/submissions');
                const submissions = response.data;

                // Group submissions by date and count them
                const submissionsByDate = {};
                submissions.forEach(submission => {
                    const createdAt = new Date(submission.time);
                    const date = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`; // Format as "YYYY-MM-DD"

                    if (!submissionsByDate[date]) {
                        submissionsByDate[date] = 0;
                    }
                    submissionsByDate[date]++;
                });

                // Sort dates (timeline)
                const sortedDates = Object.keys(submissionsByDate).sort();

                // Prepare chart data
                const data = sortedDates.map(date => submissionsByDate[date]);

                setLineChartData({
                    labels: sortedDates, // Timeline on the x-axis
                    datasets: [
                        {
                            label: 'Submissions',
                            data,
                            fill: false,
                            borderColor: '#42A5F5', // Blue color for the line
                            tension: 0.4
                        }
                    ]
                });

                setLineChartOptions({
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Submissions Over Time'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Timeline (Year-Month-Day)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Submissions'
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching submissions data:', error);
            }
        };

        fetchSubmissionsData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="card mb-4">
                {lineChartData && lineChartOptions ? (
                    <Chart type="line" data={lineChartData} options={lineChartOptions} />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;