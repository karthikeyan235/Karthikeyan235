import React, { useState, useEffect, useContext } from 'react'
import Details from './Details';
import toast from 'react-hot-toast';
import { getAPI } from '../../caller/axiosUrls';
import Loader from '../Loader';
import NotFound from '../NotFound';
import { PlanContext } from '../../contexts/PlanContext';
import { useTranslation } from 'react-i18next'; 

function DetailTable() {
    const { t } = useTranslation();
    const [tableinfo, setTableInfo] = useState([]);
    const [detailShow, setDetailShow] = useState(true);

    const { iid } = useContext(PlanContext);

    const getData = async () => {
        setTableInfo([]);
        setDetailShow(true);
    
        try {
          const response = await getAPI('/quiz/marksForTeacherWithDeviations');
          const data = response.marks;
    
          if (data.length > 0) {
            setTableInfo(data);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setDetailShow(false);
        }
    };

    useEffect(() => {
        if (iid) getData();
    }, [iid]);
  return (
    <>  
        {detailShow ? <div className='w-full mt-10 h-full'><Loader type={1} text={t('loading...')} /></div> : null}
        {!detailShow && tableinfo.length === 0 ? <div className='w-full h-full'><NotFound text={t('nqdf')} /></div> : null} 
        {(tableinfo.length > 0) ? 
        <Details tableinfo={tableinfo}/> : null}
    </>
  )
}

export default DetailTable