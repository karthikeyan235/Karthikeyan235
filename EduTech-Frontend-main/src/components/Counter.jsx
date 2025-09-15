import React from 'react';
import CountUp from 'react-countup';

const Counter = ({ value, decimal }) => {
  return (
    <>
      {decimal ? 
        <CountUp 
          start={0}  // Starting value
          end={value} // End value
          duration={2} // Duration in seconds
          separator="," // Add a comma separator (optional)
          decimals={2} // Number of decimal places (optional)
        /> :
        <CountUp 
          start={0}  // Starting value
          end={value} // End value
          duration={2} // Duration in seconds
          separator="," // Add a comma separator (optional)
        />
      }
    </>
  );
};

export default Counter;
