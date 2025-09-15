import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from "react-i18next";

function QuizRankChart({ tableinfo, selectedQuiz }) {
  const { i18n, t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const [refresh, setRefresh] = useState(false); // State to trigger a re-render

  useEffect(() => {
    // Function to prepare chart data
    const prepareChartData = () => {
      // Filter the students based on the selected quiz
      const filteredStudents = tableinfo.filter(student => student.quizName === selectedQuiz);

      // If no students found for the selected quiz, return null to avoid rendering the chart
      if (filteredStudents.length === 0) {
        setChartData(null);
        return;
      }

      // Sort students by total percentage in descending order
      const sortedStudents = [...filteredStudents].sort((a, b) => b.totalPercentage - a.totalPercentage);

      // Prepare the chart data
      const data = {
        labels: sortedStudents.map(student => student.username).slice(0, 10), // X-axis: student names (changed to `username`)
        datasets: [
          {
            label: t('totalscore%'),
            data: sortedStudents.map(student => student.totalPercentage).slice(0, 10), // Y-axis: student scores
            backgroundColor: '#367CFF', // Bar color
            borderWidth: 1,
            borderRadius: 5,
            datalabels: {
              color: 'white',
              font: {
                weight: 'medium',
                size: 14,
              },
            },
          },
        ],
      };

      setChartData(data);
    };

    // Call the function initially to set the data
    prepareChartData();

    // Set up an interval to update the chart data every 5 seconds
    const intervalId = setInterval(() => {
      prepareChartData();
      setRefresh(prev => !prev); // Toggle the refresh state to trigger re-render
    }, 3000); // 3000 ms = 3 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [tableinfo, selectedQuiz]); // Dependencies to re-run useEffect when tableinfo or selectedQuiz change

  // If no data is available, show a message
  if (!chartData) {
    return <p>{t('nsfftq')}</p>;
  }

  // Chart options to modify grid, axis, and label colors with animation settings
  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1500, // Duration of the animation (in ms)
      easing: 'easeOutBounce', // Easing function to make the animation feel smooth
      onProgress: function (animation) {
        // You can use this callback to track the progress of the animation (optional)
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Disable grid lines
        },
        ticks: {
          color: 'black', // Set Y-axis labels to black
        },
      },
      x: {
        ticks: {
          color: 'black', // Set X-axis labels to black
        },
        grid: {
          display: false, // Disable grid lines
        },
      },
    },
    plugins: {
      datalabels: {
        display: true, // Enable displaying data values on bars
        color: 'black', // Set data value color to black
      },
    },
  };

  return (
    <div className=''>
      <Bar data={chartData} options={chartOptions} key={refresh} /> {/* Add key={refresh} to force re-render */}
    </div>
  );
}

export default QuizRankChart;