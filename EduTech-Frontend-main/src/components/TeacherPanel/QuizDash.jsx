import React, { useState } from 'react';
import QuizRankChart from './QuizRankChart';
import QuizSubjectwise from './QuizSubjectwise';
import QuizVerticalChart from './QuizVerticalChart'; // Import the correct component
import QuizHorizontalSubjectWise from './QuizHorizontalSubjectWise';
import { useTranslation } from "react-i18next";

function QuizDash({ tableinfo }) {
  const { t } = useTranslation();
  // Get a unique list of quiz names and  from the data
  const quizNames = [...new Set(tableinfo.map(student => student.quizName))];
  const quizSubjects = ['', ...new Set(tableinfo.map(entry => entry.quizSubject))];

  // Set the first quiz name as the defaultsubjects selected quiz
  const [selectedQuiz, setSelectedQuiz] = useState(quizNames[0]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleQuizChange = (event) => {
    setSelectedQuiz(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  // Filter data by selected subject only for the QuizSubjectwise component
  const filteredSubjectData = tableinfo.filter(entry =>
    selectedSubject === '' || entry.quizSubject.toLowerCase().includes(selectedSubject.toLowerCase())
  );

  return (
    <div>
      {/* Pass the full tableinfo to QuizRankChart and QuizVerticalChart */}
      <div className='mt-8 mx-5'>
        <div className='flex gap-20 items-start justify-around'>
          <div className='flex-1'>
            <div className='relative mb-5'>
              <label className='peer-focus:font-medium absolute text-sm text-customBlue duration-300 transform -translate-y-6 scale-75 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-semibold ml-1'>{t('quizname')}</label>
              <select name="quizId" value={selectedQuiz} onChange={handleQuizChange} className="px-4 w-full py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {quizNames.map(quiz => (
                  <option key={quiz} value={quiz}>
                    {quiz}
                  </option>
                ))}
              </select>
            </div>
            <QuizRankChart tableinfo={tableinfo} selectedQuiz={selectedQuiz} />
          </div>
          <div>
            <div className='relative mb-4'>
              <label className='peer-focus:font-medium absolute text-sm text-customBlue duration-300 transform -translate-y-6 scale-75 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-semibold ml-1'>{t('subjectname')}</label>
              <input
                type="text"
                name="quizSubject"
                value={selectedSubject}
                onChange={handleSubjectChange}
                placeholder={t('esn')}
                className="px-4 w-full py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <QuizSubjectwise data={filteredSubjectData} />
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='mx-8 mt-24'>
            <p className="font-semibold text-[24px] text-center text-customBlue">
              {t('swpb')}
            </p>
            <QuizVerticalChart tableinfo={tableinfo} selectedQuiz={selectedQuiz} selectedSubjectAny={filteredSubjectData} />
          </div>
          <div className='mx-8 mt-5 mb-24'>
            <p className="font-semibold text-[24px] text-center text-customBlue mt-10 mb-6">
              {t('qaswb')}
            </p>
            <QuizHorizontalSubjectWise data={filteredSubjectData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizDash;