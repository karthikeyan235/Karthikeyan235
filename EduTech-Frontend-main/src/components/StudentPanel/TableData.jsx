import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { getAPI } from '../../caller/axiosUrls';
import Loader from '../Loader';
import NotFound from '../NotFound';
import { format } from 'date-fns';
import { PlanContext } from '../../contexts/PlanContext';
import { useTranslation } from "react-i18next";

function TableData() {
    const { i18n, t } = useTranslation();
    const [tableinfo, setTableInfo] = useState([]);
    const [tableLoader, setTableLoader] = useState(true);

    const { iid } = useContext(PlanContext);

    const recordsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        startDate: '',
        quizName: '',
        quizSubject: ''
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
    const filteredData = tableinfo.filter(item => {
        const createdDate = new Date(item.createdAt).setHours(0, 0, 0, 0); // Remove the time part of createdAt
        const startDate = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null; // Remove time from startDate
    
        return (
            (!filters.startDate || createdDate === startDate) &&
            (!filters.quizName || item.quizName.toLowerCase().includes(filters.quizName.toLowerCase())) &&
            (!filters.quizSubject || item.quizSubject.toLowerCase().includes(filters.quizSubject.toLowerCase()))
        );
    });

    // Function to get the records for the current page (from filtered data)
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        return filteredData.slice(startIndex, endIndex);  {/* Changed this line to use filteredData */}
    };

    // Handlers for page navigation
    const handleNext = () => {
        if (currentPage * recordsPerPage < filteredData.length) {  {/* Changed to use filteredData */}
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const getData = async () => {
        setTableInfo([]);
        setTableLoader(true);
    
        try {
          const response = await getAPI('/quiz/marksWithDeviations');
          const data = response.marks;
    
          if (data.length > 0) {
            setTableInfo(data);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setTableLoader(false);
        }
    };

    useEffect(() => {
        if (iid) getData();
      }, [iid]);

    return (
        <>
            {tableLoader ? <div className='w-full mt-10 h-full'><Loader type={1} text={t('loading...')} /></div> : null}
            {!tableLoader && tableinfo.length === 0 ? <div className='w-full h-full'><NotFound text={t('noquizdatafound')} /></div> : null} 
            {(tableinfo.length > 0) ? 
            <>
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
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-black uppercase text-sm leading-6">
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
                                    <td className="py-3 px-6 text-left whitespace-nowrap font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.quizSubject}</td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible">{item.quizName}</td>
                                    <td className="py-3 px-6 text-left font-semibold border border-customBlue overflow-hidden overflow-ellipsis hover:overflow-visible"> {format(new Date(item.createdAt), 'dd-MM-yyyy')}</td>
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
            </> : null}
        </>
    );
}

export default TableData;
