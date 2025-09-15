import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next'; 

// Register necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Function to generate random pastel colors
const generatePastelColor = () => {
  const r = Math.floor(Math.random() * 127 + 128); // Random value between 128 and 255
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  return `rgba(${r}, ${g}, ${b}, 0.8)`; // RGBA with opacity
};

function QuizVerticalChart({ tableinfo, selectedQuiz, selectedSubjectAny }) {
  // Ensure selectedSubjectAny is a string or fallback to an empty string
  const { t,i18n } = useTranslation();
  const subjectFilter = typeof selectedSubjectAny === 'string' ? selectedSubjectAny.toLowerCase() : '';

  // Filter the data based on selected quiz and selected subject (if provided)
  const filteredData = tableinfo.filter(student => {
    const isQuizMatch = selectedQuiz ? student.quizName === selectedQuiz : true;
    const isSubjectMatch = subjectFilter ? student.quizSubject.toLowerCase().includes(subjectFilter) : true; // Changed to `quizSubject`
    return isQuizMatch && isSubjectMatch;
  });

  // Calculate the average percentage for each student in the filtered data
  const studentAvgPercentages = filteredData.map(student => {
    const { username, mcqPercentage, descriptivePercentage, numericalPercentage } = student; // Changed to `username`

    // Calculate the average percentage of the student
    const avgPercentage = (mcqPercentage + descriptivePercentage + numericalPercentage) / 3;
    return {
      username, // Updated key
      avgPercentage,
    };
  });

  // Sort students by average percentage in descending order
  studentAvgPercentages.sort((a, b) => b.avgPercentage - a.avgPercentage);

  // Dynamically generate colors for each student
  const dynamicColors = studentAvgPercentages.map(() => generatePastelColor());

  // Prepare data for the bar chart
  const data = {
    labels: studentAvgPercentages.map(student => student.username).slice(0, 10), // Student names on the Y-axis
    datasets: [
      {
        label: t('averagepercentagew%'),
        data: studentAvgPercentages.map(student => student.avgPercentage).slice(0, 10), // Average percentages on the X-axis
        backgroundColor: dynamicColors, // Use dynamically generated colors
        borderWidth: 1,
        borderRadius: 30,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    indexAxis: 'y', // This makes the chart horizontal (by default it is vertical)
    plugins: {
      title: {
        display: true,
        font: {
          size: 18,
          color: 'black',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw.toFixed(2)}%`; // Format the tooltip value
          },
        },
      },
      datalabels: {
        display: false, // Disable data labels
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('averagepercentagew%'),
        },
        grid: {
          display: false, // Disable grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: t('studentname'),
        },
        grid: {
          display: false, // Disable grid lines
        },
        ticks: {
          autoSkip: false, // Avoid skipping labels if there are too many students
          maxRotation: 0, // No rotation needed as labels are now on the Y-axis
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div className="h-[70vh] w-11/12 mx-[5rem]">
      <Bar data={data} options={options} />
    </div>
  );
}

export default QuizVerticalChart;