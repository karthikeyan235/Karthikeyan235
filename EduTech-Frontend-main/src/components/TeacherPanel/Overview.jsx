import React, { useState, useContext, useEffect } from 'react'
import TopStats from './TopStats';
import { FaSearch } from "react-icons/fa";
import OverviewBar from './OverviewBar';
import OverviewSideCounts from './OverviewSideCounts';
import Topperlist from './Topperlist';
import { getAPI } from '../../caller/axiosUrls';
import { PlanContext } from '../../contexts/PlanContext';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import NotFound from '../NotFound';
import { useTranslation } from "react-i18next";

function Overview() {
  const { i18n, t } = useTranslation();
  const [quizData, setQuizData] = useState([]);
  const [loadingQuizData, setLoadingQuizData] = useState(true);

  const { iid } = useContext(PlanContext)

  const [filters, setFilters] = useState({
    quizId: '',
    studentName: '',
    createdAt: '',
  });

  const [overviewCounts, setOverviewCounts] = useState({
    totalStudents: 0,
    totalQuizzesGenerated: 0,
    totalQuizzesTaken: 0,
    totalTeachers: 0
  });

  const formatDate = (date) => new Date(date).toLocaleDateString('en-CA'); // 'en-CA' gives format YYYY-MM-DD

  const getData = async () => {
    setQuizData([]);
    setLoadingQuizData(true);

    try {
      const response = await getAPI('/quiz/studentMarksByQuiz');
      const response1 = await getAPI('/quiz/instituteOverview');
      const data = response.quizData;
      const { totalStudents, totalTeachers, totalQuizzesGenerated, totalQuizzesTaken } = response1.data;

      if (data.length > 0) {
        setQuizData(data);
      }
      setOverviewCounts({
        totalStudents,
        totalTeachers,
        totalQuizzesGenerated,
        totalQuizzesTaken
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingQuizData(false);
    }
  };

  const applyFilters = () => {
    return quizData.map(quiz => ({
      ...quiz,
      students: quiz.students.filter(student => {
        // Filter by Quiz Name
        const matchesQuizName = filters.quizName
          ? quiz.quizName.toLowerCase() === filters.quizName.toLowerCase()
          : true;
  
        // Filter by Student Name
        const matchesStudentName = filters.studentName
          ? student.name.toLowerCase().includes(filters.studentName.toLowerCase())
          : true;
          
        // Filter by Created Date
        const matchesCreatedAt = filters.createdAt
          ? formatDate(quiz.createdAt) === formatDate(filters.createdAt)
          : true;
  
        return matchesQuizName && matchesStudentName && matchesCreatedAt;
      })
    }));
  };  
  

  const filteredQuizData = applyFilters();

  const calculateOverallAverage = () => {
    const studentIds = [...new Set(filteredQuizData.flatMap(quiz => quiz.students.map(student => student.userId)))];
    const studentAverages = studentIds.map(studentId => {
      // Filter out all quizzes for this student
      const studentQuizzes = filteredQuizData.map(quiz =>
        quiz.students.find(student => student.userId === studentId)
      ).filter(student => student);

      // Calculate averages across all quizzes for the student
      const overallPerformance = studentQuizzes.reduce(
        (acc, student) => {
          acc.mcq += student.mcqPercentage;
          acc.descriptive += student.descriptivePercentage;
          acc.numerical += student.numericalPercentage;
          acc.total += student.totalPercentage;
          return acc;
        },
        { mcq: 0, descriptive: 0, numerical: 0, total: 0, count: studentQuizzes.length }
      );

      return {
        studentId,
        name: studentQuizzes[0]?.name, // Name of the student (same across quizzes)
        avgMCQ: (overallPerformance.mcq / overallPerformance.count).toFixed(2),
        avgDescriptive: (overallPerformance.descriptive / overallPerformance.count).toFixed(2),
        avgNumerical: (overallPerformance.numerical / overallPerformance.count).toFixed(2),
        avgTotal: (overallPerformance.total / overallPerformance.count).toFixed(2)
      };
    });

    // Calculate final average percentages for MCQ, Descriptive, and Numerical across all students
    const finalAverages = studentAverages.reduce(
      (acc, student) => {
        acc.avgMCQ += parseFloat(student.avgMCQ);
        acc.avgDescriptive += parseFloat(student.avgDescriptive);
        acc.avgNumerical += parseFloat(student.avgNumerical);
        acc.avgTotal += parseFloat(student.avgTotal); // Add total to the final average calculation

        return acc;
      },
      { avgMCQ: 0, avgDescriptive: 0, avgNumerical: 0, avgTotal: 0 }
    );

    const totalStudents = studentAverages.length;
    return {
      studentAverages,
      finalAvgMCQ: (finalAverages.avgMCQ / totalStudents).toFixed(2),
      finalAvgDescriptive: (finalAverages.avgDescriptive / totalStudents).toFixed(2),
      finalAvgNumerical: (finalAverages.avgNumerical / totalStudents).toFixed(2),
      finalAvgTotal: (finalAverages.avgTotal / totalStudents).toFixed(2) // Final total average percentage
    };
  };

  // Calculate the overall averages (student-wise and category-wise)
  const { studentAverages, finalAvgMCQ, finalAvgDescriptive, finalAvgNumerical, finalAvgTotal } = calculateOverallAverage();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // SideStrip calculations

  // Calculate total students (unique user IDs)
  const uniqueStudents = new Set();
  quizData.forEach(quiz => {
    quiz.students.forEach(student => {
      uniqueStudents.add(student.userId);
    });
  });
    // toppers list
  const getTopAndLastStudents = (quizData, quizId) => {
    // If quizId is provided, filter quizData for that quiz only
    const filteredQuizData = quizId
      ? quizData.filter(quiz => quiz.quizId === quizId)
      : quizData;
    const studentTotals = {};  // To store total performance across all quizzes

    // Calculate the total performance across quizzes for each student
    filteredQuizData.forEach(quiz => {
      quiz.students.forEach(student => {
        if (!studentTotals[student.userId]) {
          studentTotals[student.userId] = {
            totalPercentage: 0,
            count: 0,
          };
        }
        studentTotals[student.userId].totalPercentage += student.totalPercentage;
        studentTotals[student.userId].count += 1;
      });
    });

    // Calculate the average performance for each student
    const studentPerformance = Object.entries(studentTotals).map(([userId, { totalPercentage, count }]) => {
      const avgPerformance = totalPercentage / count;
      const studentNames = filteredQuizData.map(quiz => 
        quiz.students.filter(student => student.userId === userId)
      ).flat(); // Flatten the array since it might have nested results
    
      // Extract the student's name, if available, otherwise fallback to 'Unknown'
      const studentName = studentNames.length > 0 ? studentNames[0].name : 'Unknown';
      
      return {
        userId, avgPerformance,
        name: studentName || 'Unknown'  // Add the student's name

      };
    });

    // Sort students by their average performance (combined total)
    const sortedStudents = studentPerformance.sort((a, b) => b.avgPerformance - a.avgPerformance);

    // Get the top 3 students
    const top3Students = sortedStudents.slice(0, 3); // Only top 3 students

    // Get the bottom 3 students (last 3)
    const last3Students = sortedStudents.slice(-3); // Last 3 students

    return {
      top3Students, // Overall top 3 students based on average performance
      last3Students, // Overall last 3 students based on average performance
    };
  };
  const { top3Students, last3Students } = getTopAndLastStudents(quizData, filters.quizId);  // Use full quizData for Topperlist

  useEffect(() => {
    if (iid) getData();
  }, [iid]);
  
  return (
    <>
      {loadingQuizData ? <div className='w-full mt-10 h-full'><Loader type={1} text={t('loading...')} /></div> : null}
      {!loadingQuizData && quizData.length === 0 ? <div className='w-full h-full'><NotFound info={"Oops!"} text={t('yhtadtga')} /></div> : null} 
      {(quizData.length > 0) ? 
      <div>
        <div className="flex mb-3 mt-3 space-around">
          {/* <div className='relative z-0 w-full group'>
            <input type="text" name="studentName" value={filters.studentName} onChange={handleFilterChange} placeholder="Student Name" className="px-4 py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div> */}
          
          <div className="w-1/2 group">
            <div className='relative mx-auto w-9/12'>
              <input
                type="text"
                name="studentName"
                value={filters.studentName}
                onChange={handleFilterChange}
                placeholder={t('studentname')}
                className="px-4 py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" // Add pr-10 to add space on the right for the icon
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
            </div>
          </div>

          <div className='flex items-center mx-auto'>
            <div className='relative z-0 w-full group mx-6'>
              <label className='peer-focus:font-medium absolute text-sm text-customBlue duration-300 transform -translate-y-6 scale-75  -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-semibold ml-1'>{t('quizname')}</label>
              <select name="quizName" value={filters.quizName} onChange={handleFilterChange} className="px-4 py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{t('overallperformance')}</option>
                {quizData.map((quiz) => (
                  <option key={quiz.quizId} value={quiz.quizName}>
                    {quiz.quizName}
                  </option>
               ))}
              </select>
            </div>

            <div className='relative z-0 w-full group'>
              <label className='peer-focus:font-medium absolute text-sm text-customBlue duration-300 transform -translate-y-6 scale-75 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-semibold ml-1'>{t('qid')}</label>
              <input type="date" name="createdAt" value={filters.createdAt} onChange={handleFilterChange} className="px-4 py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-between w-full mx-5">
            <TopStats finalperformance={finalAvgTotal} finalmcqavg={finalAvgMCQ} finalnumericavg={finalAvgNumerical} finaldescript={finalAvgDescriptive} />
            <OverviewSideCounts
              totalStudents={overviewCounts.totalStudents}
              totalQuizzesGenerated={overviewCounts.totalTeachers}
              totalQuizzesTaken={overviewCounts.totalQuizzesGenerated}
              totalTeachers={overviewCounts.totalQuizzesTaken}
            />
          </div>

          <div className="flex w-full px-5 justify-between mt-3 lg:flex-row sm:flex-col">
            <OverviewBar studentAverages={studentAverages} />
            <Topperlist
              top3Students={top3Students}
              last3Students={last3Students}
            />
          </div>
        </div>
      </div> : null}
    </>
  )
}

export default Overview