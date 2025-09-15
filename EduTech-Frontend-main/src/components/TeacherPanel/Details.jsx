import React, { useState , useMemo} from 'react';
import DetailsSpiral from './DetailsSpiral';
import DetailsBoxes from './DetailsBoxes';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

function Details({tableinfo}) {
    const { i18n, t } = useTranslation();
    const recordsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        startDate: '',
        quizName: '',
        quizSubject: '',
        username: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
        setCurrentPage(1); // Reset to the first page when filters change
    };

    // Filter data based on the filters
    const filteredData = useMemo(() => {
        return tableinfo.filter(item => {
            const createdDate = new Date(item.createdAt).setHours(0, 0, 0, 0); // Remove the time part of createdAt
            const startDate = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null; // Remove time from startDate

        return (
            (!filters.startDate || createdDate === startDate) &&
            (!filters.quizName || item.quizName?.toLowerCase().includes(filters.quizName.toLowerCase())) &&
            (!filters.quizSubject || item.quizSubject?.toLowerCase().includes(filters.quizSubject.toLowerCase())) &&
            (!filters.username || item.username?.toLowerCase().includes(filters.username.toLowerCase()))
          
        );
    });
    }, [tableinfo, filters]);

    // Function to get the records for the current page (from filtered data)
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        return filteredData.slice(startIndex, endIndex); {/* Changed this line to use filteredData */ }
    };

    // Handlers for page navigation
    const handleNext = () => {
        if (currentPage * recordsPerPage < filteredData.length) {
            {/* Changed to use filteredData */ }
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    // Calculate averages and total quizzes
    const averages = useMemo(() => {
        if (filteredData.length === 0) {
            return {
                avgDescriptivePercentage: 0,
                avgMCQPercentage: 0,
                avgNumericPercentage: 0,
                avgTotalPercentage: 0,
                avgGrade: '',
                totalQuizzes: 0
            };
        }

        const totalDescriptive = filteredData.reduce((sum, item) => sum + item.descriptivePercentage, 0);
        const totalMCQ = filteredData.reduce((sum, item) => sum + item.mcqPercentage, 0);
        const totalNumeric = filteredData.reduce((sum, item) => sum + item.numericalPercentage, 0);
        const totalPercentage = filteredData.reduce((sum, item) => sum + item.totalPercentage, 0);
        const totalQuizzes = filteredData.length;

        // Calculate averages
        return {
            avgDescriptivePercentage: (totalDescriptive / totalQuizzes).toFixed(2),
            avgMCQPercentage: (totalMCQ / totalQuizzes).toFixed(2),
            avgNumericPercentage: (totalNumeric / totalQuizzes).toFixed(2),
            avgTotalPercentage: (totalPercentage / totalQuizzes).toFixed(2),
            avgGrade: filteredData[0].grade, // Assuming grade is the same for all quizzes in filtered data
            totalQuizzes
        };
    }, [filteredData]);


    return (
        <div className="p-4">
            <div className="flex space-x-4 mb-4">
                <div className='relative z-0 w-full group'>
                    <label className='peer-focus:font-medium absolute text-sm text-customBlue duration-300 transform -translate-y-6 scale-75  -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-semibold ml-1'>{t('qid')}</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        placeholder={t('startingdate')}
                        className="px-4 py-2 border border-blue-600 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {/* Added Name filter */}
                <input
                    type="text"
                    name="username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    placeholder={t('learnersname')}
                    className="px-4 py-2 border border-blue-600 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="quizName"
                    value={filters.quizName}
                    onChange={handleFilterChange}
                    placeholder={t('quizname')}
                    className="px-4 py-2 border border-blue-600 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="quizSubject"
                    value={filters.quizSubject}
                    onChange={handleFilterChange}
                    placeholder={t('subject')}
                    className="px-4 py-2 border border-blue-600 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="overflow-x-auto rounded-[30px] border">
                <table className="min-w-full bg-white border border-customBlue">
                    <thead>
                        <tr className="bg-gray-100 text-black uppercase text-sm leading-6">
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('name')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('subject')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('quiz')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('attemptedat')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('mcq%')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">
                                <span className="flex items-center">
                                    {t('descriptive')} <span className="ml-1">%</span>
                                </span>
                            </th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">
                                <span className="flex items-center">
                                    {t('numerical')} <span className="ml-1">%</span>
                                </span>
                            </th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">
                                <span className="flex items-center">
                                    {t('total')} <span className="ml-1">%</span>
                                </span>
                            </th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('grade')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('deviation')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('fse')}</th>
                            <th className="py-3 px-6 text-left border border-customBlue text-center">{t('noisedetect')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-customBlue text-sm font-light">
                        {getCurrentPageData().map((item) => (
                            <tr key={item._id} className="border-b border-customBlue hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.username}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.quizSubject}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.quizName}</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{format(new Date(item.createdAt), 'dd-MM-yyyy')}</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.mcqPercentage.toFixed(2)}%</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.descriptivePercentage.toFixed(2)}%</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.numericalPercentage.toFixed(2)}%</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.totalPercentage.toFixed(2)}%</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.grade}</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.deviation_count}</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.fullscreen_exit_count}</td>
                                <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.noise_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-customBlue text-white rounded-[10px] hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {t('previous')}
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage * recordsPerPage >= filteredData.length}
                    className="px-4 py-2 bg-customBlue text-white rounded-[10px] hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {t('next')}
                </button>
                
            </div>
            <DetailsSpiral tableinfo={tableinfo}/>
            <DetailsBoxes
                avgDescriptivePercentage={averages.avgDescriptivePercentage}
                avgMCQPercentage={averages.avgMCQPercentage}
                avgNumericPercentage={averages.avgNumericPercentage}
                avgTotalPercentage={averages.avgTotalPercentage}
                avgGrade={averages.avgGrade}
                totalQuizzes={averages.totalQuizzes}
            />

        </div>
    );
}

export default Details;
