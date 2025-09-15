import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { useTranslation } from "react-i18next";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function OverviewBar({ studentAverages }) {
  // Prepare the combined data for the chart
  let studentData = studentAverages.slice(0, 10);
  const { i18n, t } = useTranslation();
  const labels = studentData.map(student => student.name); // Student names for the x-axis
  const mcqData = studentData.map(student => parseFloat(student.avgMCQ));
  const descriptiveData = studentData.map(student => parseFloat(student.avgDescriptive));
  const numericalData = studentData.map(student => parseFloat(student.avgNumerical));

  // Combined chart data
  const data = {
    labels: labels, // x-axis labels (student names)
    datasets: [
      {
        label: 'MCQ',
        data: mcqData, // MCQ scores for all students
        backgroundColor:  '#8DDBE0',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 6, // Apply borderRadius for rounded corners
      },
      {
        label: 'Desc.',
        data: descriptiveData, // Descriptive scores for all students
        backgroundColor:  '#C0DBFF',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 6, // Apply borderRadius for rounded corners

      },
      {
        label: 'Num.',
        data: numericalData, // Numerical scores for all students
        backgroundColor:  '#94ABFF',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 6, // Apply borderRadius for rounded corners

      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Student Performance Across Categories'
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Format tooltip to show percentage
          }
        }
      },
      datalabels: {
        display: false, // Enable data labels
        rotation: 270, // Rotate the labels vertically (90 degrees)
        formatter: (value, context) => {
            // Get the label for the dataset
            return context.dataset.label; // Return the label of the dataset (MCQ, Descriptive, Numerical)
          }      
        }
    },
    scales: {
        y: {
          beginAtZero: true,
          max: 100, // Set the y-axis to a max of 100% (as percentages are used)
          ticks: {
            stepSize: 10,
            color: '#2E5BFF', // Set the Y-axis tick labels to blue
            size: 30
          },
          grid: {
            display: false, // Disable the grid on the y-axis
          }
        },
        x: {
          ticks: {
            color: '#000000', // Set the X-axis tick labels to black
          },
          grid: {
            display: false, // Disable the grid on the y-axis
          }
        }
      }
    };

  return (
    <div className="mr-8" style={{ width: '650px', height: '450px' }}> {/* Set custom width and height */}
      <h3 className="font-semibold text-customBlue text-xl">{t('averagepercentage')}</h3>
      <Bar className='mt-4' data={data} options={options} />
    </div>
  );
}

export default OverviewBar;
