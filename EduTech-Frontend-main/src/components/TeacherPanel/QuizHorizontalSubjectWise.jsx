import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// Function to generate random pastel colors
const generatePastelColor = () => {
  const r = Math.floor(Math.random() * 127 + 128); // Random value between 128 and 255
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  return `rgba(${r}, ${g}, ${b}, 0.8)`; // RGBA with opacity
};

function QuizHorizontalSubjectWise({ data }) {
  // Extract unique student names and subjects
  const userNames = [...new Set(data.map(entry => entry.username))]; // Updated to `username`
  const subjects = [...new Set(data.map(entry => entry.quizSubject))]; // Updated to `quizSubject`

  // Dynamically generate colors for each subject
  const subjectColors = subjects.map(() => generatePastelColor());

  // Create the chart data with student names as labels and subjects as datasets
  const chartData = {
    labels: userNames.slice(0, 10),
    datasets: subjects.map((subject, index) => {
      return {
        label: subject,
        data: userNames.map(user => {
          const entry = data.find(d => d.username === user && d.quizSubject === subject); // Updated keys
          return entry ? entry.totalPercentage : 0; // Use 0 if no data is present
        }),
        backgroundColor: subjectColors[index % subjectColors.length],
      };
    }).slice(0, 10),
  };

  const options = {
    responsive: true,
    indexAxis: 'y', // This makes the chart horizontal (by default it is vertical)
    scales: {
      x: {
        stacked: true,
        max: 120,
        grid: {
          display: false,
        },
        ticks: {
          color: 'black',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'black',
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Disable the default legend to use custom legend below
      },
      datalabels: {
        display: false,
        color: 'black',
      },
    },
  };

  // Custom legend rendering
  const customLegend = (
    <div className="flex justify-center mt-4">
      {subjects.map((subject, index) => (
        <div key={subject} className="flex items-center mx-2">
          <div
            style={{
              backgroundColor: subjectColors[index % subjectColors.length],
              borderRadius: '50%',
              width: '12px',
              border: 'solid 1px black',
              height: '12px',
              marginRight: '8px',
            }}
          ></div>
          <span className="text-sm font-semibold">{subject}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-[70vh] w-11/12 mx-[5rem]">
      <Bar data={chartData} options={options} />
      {customLegend}
      <br />
    </div>
  );
}

export default QuizHorizontalSubjectWise;