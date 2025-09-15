import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import '../../styles/OnlyCharts.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import { useTranslation } from "react-i18next";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, RadialLinearScale);

const OnlyCharts = ({ dummydata }) => {
    const { i18n, t } = useTranslation();
    const [currentChart, setCurrentChart] = useState('pie'); // 'pie', 'bar', 'line'
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Toggle between the charts every 5 seconds with a visibility delay
    useEffect(() => {
        setIsVisible(true); // Initial load animation
    
        const chartTypes = ['pie', 'bar', 'line', 'radar', 'doughnut']; // Include all chart types
    
        const changeChart = () => {
            setIsVisible(false); // Start fade-out
            setTimeout(() => {
                setCurrentChart(prev => {
                    const currentIndex = chartTypes.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % chartTypes.length; // Cycle through all chart types
                    return chartTypes[nextIndex];
                });
                setIsVisible(true); // Start fade-in after chart switch
            }, 1000); // Delay matches the CSS transition duration
        };

        const interval = setInterval(() => {
            if (!isPaused) {
                changeChart();
            }
        }, 3000); // Change chart every 5 seconds

        return () => clearInterval(interval); // Clean up the interval on unmount
    }, [isPaused]); // Depend on isPaused

    // Event handlers for pausing/resuming the chart transition
    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    const getPieChartData = () => {
        const selectedData = dummydata[0]; // Assuming dummydata has only one selected quiz

        return {
            labels: ['MCQ', 'Descriptive', 'Numerical'],
            datasets: [
                {
                    data: [
                        selectedData.mcqPercentage,
                        selectedData.descriptivePercentage,
                        selectedData.numericalPercentage,
                    ],
                    backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                    hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                },
            ],
        };
    };

    const getBarChartData = () => {
        const quizNames = dummydata.map(data => data.quizId);
        const mcqData = dummydata.map(data => data.mcqPercentage);
        const descriptiveData = dummydata.map(data => data.descriptivePercentage);
        const numericalData = dummydata.map(data => data.numericalPercentage);

        return {
            labels: quizNames,
            datasets: [
                {
                    label: 'MCQ Percentage',
                    data: mcqData,
                    backgroundColor: '#36A2EB',
                },
                {
                    label: 'Descriptive Percentage',
                    data: descriptiveData,
                    backgroundColor: '#FFCE56',
                },
                {
                    label: 'Numerical Percentage',
                    data: numericalData,
                    backgroundColor: '#FF6384',
                },
            ],
        };
    };

    const getLineChartData = () => {
        const quizNames = dummydata.map(data => data.quizId);
        const mcqData = dummydata.map(data => data.mcqPercentage);
        const descriptiveData = dummydata.map(data => data.descriptivePercentage);
        const numericalData = dummydata.map(data => data.numericalPercentage);

        return {
            labels: quizNames,
            datasets: [
                {
                    label: 'MCQ Percentage',
                    data: mcqData,
                    borderColor: '#36A2EB',
                    fill: false,
                    tension: 0.2,
                },
                {
                    label: 'Descriptive Percentage',
                    data: descriptiveData,
                    borderColor: '#FFCE56',
                    fill: false,
                    tension: 0.2,
                },
                {
                    label: 'Numerical Percentage',
                    data: numericalData,
                    borderColor: '#FF6384',
                    fill: false,
                    tension: 0.2,
                },
            ],
        };
    };

    const getRadarChartData = () => {
        const quizNames = dummydata.map(data => data.quizId);
        const mcqData = dummydata.map(data => data.mcqPercentage);
        const descriptiveData = dummydata.map(data => data.descriptivePercentage);
        const numericalData = dummydata.map(data => data.numericalPercentage);

        return {
            labels: quizNames,
            datasets: [
                {
                    label: 'MCQ Percentage',
                    data: mcqData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: '#36A2EB',
                    pointBackgroundColor: '#36A2EB',
                },
                {
                    label: 'Descriptive Percentage',
                    data: descriptiveData,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: '#FFCE56',
                    pointBackgroundColor: '#FFCE56',
                },
                {
                    label: 'Numerical Percentage',
                    data: numericalData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: '#FF6384',
                    pointBackgroundColor: '#FF6384',
                },
            ],
        };
    };

    const getDoughnutChartData = () => {
        const selectedData = dummydata[0];

        return {
            labels: ['MCQ', 'Descriptive', 'Numerical'],
            datasets: [
                {
                    data: [
                        selectedData.mcqPercentage,
                        selectedData.descriptivePercentage,
                        selectedData.numericalPercentage,
                    ],
                    backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                    hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                },
            ],
        };
    };
    // Other chart data generation functions...
    return (
        <div className="charts-container flex flex-col my-1 items-center h-[70vh]">
            <div
                className={`chart-container w-full h-full justify-center items-center ${isVisible ? 'visible' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <h3 className="font-semibold text-center mb-1">
                    {currentChart === 'pie'
                        ? t('mdanp')
                        : currentChart === 'bar'
                        ? t('cop')
                        : currentChart === 'line'
                        ? t('topoq')
                        : currentChart === 'radar'
                        ? t('rcop')
                        : t('dcop')}
                </h3>

                {currentChart === 'pie' && <Pie data={getPieChartData()} options={{ responsive: true }} />}
                {currentChart === 'bar' && <Bar data={getBarChartData()} options={{ responsive: true, maintainAspectRatio: false }} />}
                {currentChart === 'line' && <Line data={getLineChartData()} options={{ responsive: true, maintainAspectRatio: false }} />}
                {currentChart === 'radar' && <Radar data={getRadarChartData()} options={{ responsive: true, maintainAspectRatio: false }} />}
                {currentChart === 'doughnut' && <Doughnut data={getDoughnutChartData()} options={{ responsive: true, maintainAspectRatio: false }} />}
            </div>
        </div>
    );
};

export default OnlyCharts;
