import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axiosInstance from '../../utils/axiosInstance';

const AdminDashboard = () => {
    const [problemStats, setProblemStats] = useState({ easy: 0, medium: 0, hard: 0 });

    useEffect(() => {
        const fetchProblemStats = async () => {
            try {
                const response = await axiosInstance.get('/problems/stats');
                setProblemStats(response.data);
            } catch (error) {
                console.error('Error fetching problem statistics:', error);
            }
        };

        fetchProblemStats();
    }, []);

    const lineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Problems Solved',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.4
            },
            {
                label: 'Solved Sheets',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: '#FFA726',
                tension: 0.4
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales and Revenue'
            }
        }
    };

    const pieChartData = {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
            {
                data: [problemStats.easy, problemStats.medium, problemStats.hard],
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
                hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Problem Difficulty Distribution'
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="card mb-4">
                <Chart type="line" data={lineChartData} options={lineChartOptions} />
            </div>
            <div className="card" style={{ width: '200px', height: '200px' }}>
                <Chart type="pie" data={pieChartData} options={pieChartOptions} />
            </div>
        </div>
    );
};

export default AdminDashboard;