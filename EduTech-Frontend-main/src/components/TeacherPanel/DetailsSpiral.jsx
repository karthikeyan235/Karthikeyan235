import React, { useEffect, useState } from 'react';
import { Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next'; 

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

// Function to generate unique colors
function generateColors(count) {
    const colors = [];
    const hueStep = Math.floor(360 / count); // Distribute colors evenly across the color spectrum
    for (let i = 0; i < count; i++) {
        const hue = (i * hueStep) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`); // Use HSL for better color distribution
    }
    return colors;
}

function DetailsSpiral({ tableinfo }) {
    const { t } = useTranslation();
    const [pieChartData, setPieChartData] = useState({});
    const [doughnutChartData, setDoughnutChartData] = useState({});
    const [polarAreaChartData, setPolarAreaChartData] = useState({});
    const [refresh, setRefresh] = useState(false); // State to trigger a re-render

    useEffect(() => {
        if (!Array.isArray(tableinfo) || tableinfo.length === 0) {
            console.warn('tableinfo is not an array or is empty');
            return;  // Avoid processing if the data is not an array or is empty
        }

        // Quiz breakdown by subjects (Pie chart data)
        const subjectCount = {};
        tableinfo.forEach((item) => {
            const { quizSubject } = item;
            if (quizSubject) {
                subjectCount[quizSubject] = (subjectCount[quizSubject] || 0) + 1;
            }
        });

        const colors = generateColors(Object.keys(subjectCount).length);

        const pieData = {
            labels: Object.keys(subjectCount).slice(0, 10),
            datasets: [
                {
                    label: 'Quizzes by Subject',
                    data: Object.values(subjectCount).slice(0, 10),
                    backgroundColor: colors,
                    hoverOffset: 4,
                },
            ],
        };
        setPieChartData(pieData);

        // Average percentage by subjects (Doughnut chart data)
        const subjectTotalPercentage = {};
        const subjectQuizCount = {};

        tableinfo.forEach((item) => {
            const { quizSubject, totalPercentage } = item;
            if (quizSubject && totalPercentage != null) {
                subjectTotalPercentage[quizSubject] = (subjectTotalPercentage[quizSubject] || 0) + totalPercentage;
                subjectQuizCount[quizSubject] = (subjectQuizCount[quizSubject] || 0) + 1;
            }
        });

        const doughnutData = {
            labels: Object.keys(subjectTotalPercentage).slice(0, 10),
            datasets: [
                {
                    label: 'Average % by Subject',
                    data: Object.keys(subjectTotalPercentage).map(
                        (quizSubject) => (subjectTotalPercentage[quizSubject] / subjectQuizCount[quizSubject]).toFixed(2)
                    ).slice(0, 10),
                    backgroundColor: colors,
                    hoverOffset: 4,
                },
            ],
        };
        setDoughnutChartData(doughnutData);

        const polarData = {
            labels: doughnutData.labels.slice(0, 10),
            datasets: [
                {
                    label: 'Average % by Subject',
                    data: doughnutData.datasets[0].data.slice(0, 10),
                    backgroundColor: colors,
                    hoverOffset: 4,
                },
            ],
        };
        setPolarAreaChartData(polarData);

    }, [tableinfo]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRefresh(!refresh); // Toggle the refresh state after 2 seconds
        }, 3000);

        return () => clearTimeout(timer); // Clean up the timer on unmount
    }, [refresh]); // Run every time 'refresh' state changes

    const commonOptions = {
        animation: {
            duration: 3000, // Set the duration for the animation (in ms)
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        weight: 'bold', // Make legend labels bold
                    },
                    boxWidth: 20, // Optional: adjust the box width in the legend
                    padding: 15, // Optional: add some space between legend items
                    textAlign: 'center',
                },
            },
            tooltip: {
                bodyFont: {
                    weight: 'bold', // Make tooltip body font bold
                },
            },
            datalabels: {
                display: true,
                color: 'black',
                font: {
                    weight: 'bold', // Make data labels bold
                    size: 14,
                },
            },
        },
    };

    return (
        <div className="flex gap-6 mt-4 mx-8 flex-wrap justify-between">
            {/* Pie Chart Section */}
            <div className="flex-1 max-w-xs min-w-[300px] h-[400px] flex flex-col items-center justify-center">
                <p className="text-md font-semibold mb-4 text-customBlue">{t('qbbs')}</p>
                {pieChartData.labels && pieChartData.datasets && pieChartData.labels.length > 0 ? (
                    <Pie data={pieChartData} options={commonOptions} key={refresh} />
                ) : (
                    <p>{t('ndafpc')}</p>
                )}
            </div>

            {/* Polar Area Chart Section */}
            <div className="flex-1 max-w-xs min-w-[300px] h-[400px] flex flex-col items-center justify-center">
                <p className="text-md font-semibold mb-4 text-customBlue">{t('abps')}</p>
                {polarAreaChartData.labels && polarAreaChartData.datasets && polarAreaChartData.labels.length > 0 ? (
                    <PolarArea data={polarAreaChartData} options={commonOptions} key={refresh} />
                ) : (
                    <p>{t('ndafpac')}</p>
                )}
            </div>

            {/* Doughnut Chart Section */}
            <div className="flex-1 max-w-xs min-w-[300px] h-[400px] flex flex-col items-center justify-center">
                <p className="text-md font-semibold mb-4 text-customBlue">{t('apbs')}</p>
                {doughnutChartData.labels && doughnutChartData.datasets && doughnutChartData.labels.length > 0 ? (
                    <Doughnut data={doughnutChartData} options={commonOptions} key={refresh} />
                ) : (
                    <p>{t('ndafdc')}</p>
                )}
            </div>
        </div>
    );
}

export default DetailsSpiral;