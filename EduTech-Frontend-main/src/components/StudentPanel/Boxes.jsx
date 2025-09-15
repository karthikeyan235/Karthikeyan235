import React, { useEffect, useState, useContext } from 'react';
import AnimatedNumber from "animated-number-react";
import StudentCharts from './StudentCharts';
import toast from 'react-hot-toast';
import { getAPI } from '../../caller/axiosUrls';
import Loader from '../Loader';
import NotFound from '../NotFound';
import { PlanContext } from '../../contexts/PlanContext';
import { useTranslation } from 'react-i18next';

const Boxes = () => {
  const [initialData, setInitialData] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedQuizName, setSelectedQuizName] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({});
  const [dashLoader, setDashLoader] = useState(true);
  const { t } = useTranslation();

  const { iid } = useContext(PlanContext)

  const getData = async () => {
    setInitialData([]);
    setDashLoader(true);

    try {
      const response = await getAPI('/quiz/studentmarks');
      const data = response.marks;

      if (data.length > 0) {
        const initialQuizId = data[0].quizId;
        const initialQuizName = data[0].quizName;
        setInitialData(data);
        setSelectedQuizId(initialQuizId);
        setSelectedQuizName(initialQuizName);
        updateAnimatedValues(data, initialQuizId);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDashLoader(false);
    }
  };

  const updateAnimatedValues = (data, quizId) => {
    const selectedData = data.find((item) => item.quizId === quizId);
    if (selectedData) {
      setAnimatedValues({
        mcqPercentage: selectedData.mcqPercentage,
        descriptivePercentage: selectedData.descriptivePercentage,
        numericalPercentage: selectedData.numericalPercentage,
        totalPercentage: selectedData.totalPercentage,
      });
    }
  };

  const handleQuizChange = (e) => {
    const quizId = e.target.value;
    const quizName = initialData.find((item) => item.quizId === quizId)?.quizName || '';
    setSelectedQuizId(quizId);
    setSelectedQuizName(quizName);
    updateAnimatedValues(initialData, quizId);
  };

  const formatValue = (value) => value ? value.toFixed(2) : '0.00';

  const labels = selectedQuizId
    ? [
        { label: 'Descriptive Percentage', value: animatedValues.descriptivePercentage },
        { label: 'MCQ Percentage', value: animatedValues.mcqPercentage },
        { label: 'Numerical Percentage', value: animatedValues.numericalPercentage },
        { label: 'Total Percentage', value: animatedValues.totalPercentage },
        { label: 'Grade', value: initialData.find((data) => data.quizId === selectedQuizId)?.grade || 'N/A' },
      ]
    : [];

  useEffect(() => {
    if (iid) getData();
  }, [iid]);

  return (
    <>
      {dashLoader ? <div className='w-full mt-10 h-full'><Loader type={1} text={t('loading...')} /></div> : null}
      {!dashLoader && initialData.length === 0 ? <div className='w-full h-full'><NotFound info={"Oops!"} text={t('yhtadtga')} /></div> : null} 
      {(initialData.length > 0) ? 
      <div>
        <div className='relative z-0 w-full group mx-6'>
          <label className='peer-focus:font-medium absolute text-sm text-customBlue duration-300 transform -translate-y-6 scale-75 z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 font-semibold ml-1'>
            {t('quizname')}
          </label>
          <div>
            <select
              value={selectedQuizId || ''}
              onChange={handleQuizChange}
              className="px-4 py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {initialData.map((data) => (
                <option key={data.quizId} value={data.quizId}>
                  {data.quizName || data.quizId}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedQuizId && (
          <StudentCharts quizId={selectedQuizId} quizName={selectedQuizName} dummydata={initialData} />
        )}

        <div className="grid grid-cols-5 mx-[14rem] mt-6">
          {labels.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-36 h-36 rounded-[1rem] shadow-md text-[40px] font-[500] ${
                  index % 2 === 0 ? 'bg-customBlue' : 'bg-white text-customBlue'
                }`}
              >
                {item.label === 'Grade' ? (
                  <span className={`${index % 2 === 0 ? 'linear-color-2' : ''}`}>
                    {item.value}
                  </span>
                ) : (
                  <AnimatedNumber
                    className={`${index % 2 === 0 ? 'linear-color-2' : ''}`}
                    value={item.value || 0}
                    formatValue={formatValue}
                    duration={1000}
                  />
                )}
              </div>
              <div className="mt-2 text-customBlue text-center break-words">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div> : null}
    </>
  );
};

export default Boxes;