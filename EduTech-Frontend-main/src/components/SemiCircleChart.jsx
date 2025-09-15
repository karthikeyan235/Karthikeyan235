import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';

// Register the required components in Chart.js
Chart.register(ArcElement, Tooltip);

const SemiCircleChart = ({ labels, values, limit }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Progress',
        data: values,
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    rotation: -90, // Start angle (in degrees)
    circumference: 180, // Sweep angle (in degrees)
    cutout: '70%', // Adjusts the size of the center hole
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Enable display of the legend (which includes labels)
      },
      tooltip: {
        enabled: true, // Tooltip will show when hovering over the chart
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            const percentage = ((value / limit) * 100).toFixed(2); // Convert to percentage and round to 2 decimal places
            return `  ${percentage}%`; // Customize the tooltip label
          },
        },
      },
    },
  };

  return (
    <div className='z-10' style={{ width: '100%' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default SemiCircleChart;
