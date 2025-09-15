import PermissionsCheck from '../../components/PermissionCheck';
import { useContext, useEffect, useState } from 'react';
import { useRoutes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { ToastContainer } from 'react-toastify';
import DeviceWarning from '../../components/DeviceWarning';
import { PlanContext } from '../../contexts/PlanContext';
import RegisterFace from '../../components/RegisterFace';
import ProctoringWithWindowWatcher from '../../components/ProctoringSystem';

const TestPanel = ({ adaptive = false }) => {
    const [isFullscreen , setIsFullscreen] = useState(false);
    const [isExamActive , setIsExamActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const location = useLocation();
    const pathname = location.pathname;
    const { plan } = useContext(PlanContext);
    const navigate = useNavigate();

    const checkDevice = () => {
        const userAgent = navigator.userAgent;
        
        // Define patterns for mobile devices
        const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const screenWidth = window.innerWidth;
        
        if (isMobile || screenWidth < 800) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    const isBrowser = useMediaQuery({
        query: '(min-width: 1025px), (hover: hover) and (pointer: fine)'
    });

    const routes = [
        {
            path: '',
            element: <Navigate to={`${pathname}/proctor`} />,
        },
        {
            path: 'proctor',
            element: <PermissionsCheck isMobile={isMobile} setIsExamActive={setIsExamActive} setIsFullscreen={setIsFullscreen}/>,
        },
        {
            path: 'proctor/register',
            element: <RegisterFace />,
        },
        {
            path: 'proctor/exam',
            element: <ProctoringWithWindowWatcher adaptive={adaptive} setIsExamActive={setIsExamActive} setIsFullscreen={setIsExamActive} isExamActive={isExamActive} isFullscreen={isFullscreen} />,
        },
        {
            path: "*",
            element: <Navigate to='/student/quiz' />
        }
    ];

    const element = useRoutes(routes);

    useEffect(() => {
        if (plan === 'trial') {
            toast.error('Status 401: Unauthorized Access!');
            setTimeout(() => { 
                window.location.href=window.location.origin + '/student/quiz' 
            }, 500);
            return;
        }
        checkDevice();
    }, [window.innerWidth]);

    return (
        <div className='fixed top-0 left-0 z-30 w-screen h-screen bg-color'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
            />
            {isBrowser && element}
            {isMobile && <DeviceWarning />}
        </div>
    )
}

export default TestPanel;