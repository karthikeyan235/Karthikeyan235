import { useEffect, useState, useContext } from "react"; 
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
import Sidebar from "../../components/StudentPanel/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import HorizontalNav from "../../components/StudentPanel/HorizontalNav";
import Dashboard from './Dashboard';
import Upload from '../Upload';
import QuizSearch from '../QuizSearch';
import { AuthContext } from "../../contexts/AuthContext";
import { PlanContext } from '../../contexts/PlanContext';
import { SuperUserContext } from "../../contexts/SuperUserContext";
import Book from "../Book";
import CreateQuiz from "../CreateQuiz";
import CreateBook from "../CreateBook";
import Quiz from '../Quiz';
import toast from "react-hot-toast";
import TestTerminated from '../../components/TestTerminated';
import Popup from '../../components/Popup/Popup';
import Processing from "../../components/Processing";
import PromoCode from '../../components/PromoCode';
import { getAPI } from "../../caller/axiosUrls";
import Notes from '../Notes';
import NotesPage from '../NotesPage';
import ExpiryBar from '../../components/ExpiryBar';

const StudentPanel = () => {
  const { token, loading } = useContext(AuthContext);
  const { plan, setPlan, setIID, setIsDummy } = useContext(PlanContext);
  const { setSuperUser, setSupertoken } = useContext(SuperUserContext);

  const navigate = useNavigate();

  const [windowSize, setWindowSize] = useState([window.innerWidth, (window.innerWidth < 800) ? true : false]);
  const [toggle, setToggle] = useState(false);

  const routes = [
    {
      path: '',
      element: <Navigate to="/student/dashboard" />,
    }, 
    {
      path: 'dashboard',    
      element: <Dashboard />,
    },
    {
      path: 'books',
      element: <Upload />,
    },
    {
      path: 'book/:bid',
      element: <Book />
    },
    {
      path: 'quiz/:qid',
      element: <Quiz />
    },
    {
      path: 'notes',
      element: <Notes />
    },
    {
      path: 'notes/:nid',
      element: <NotesPage />
    },
    {
      path: 'create-quiz',
      element: <CreateQuiz />
    },
    {
      path: 'create-book',
      element: <CreateBook />
    },
    {
      path: 'quiz',
      element: <QuizSearch />
    },
    {
      path: 'quiz-attend',
      element: <QuizSearch />
    },
    {
      path: 'terminate',
      element: <TestTerminated />
    },
    {
      path: "*",
      element: <Navigate to='/student/dashboard' />
    }
  ];

  const getAccType = async () => {
    const role = sessionStorage.getItem('role');

    try {
      const response = await getAPI('/users/getAccountType');
      if (role !== response.role) {
        sessionStorage.setItem('role', response.role);
        toast.error("Error 401: Unauthorized Role!");
        navigate(`/${response.role}`);
      }
      setPlan(response.accType);
      if (response.registered) {
        sessionStorage.setItem('iid', response.instituteId);
        sessionStorage.setItem('instituteName', response.instituteName);
        setIsDummy(response.dummy ? response.dummy : null);
        setIID(response.instituteId);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    sessionStorage.removeItem('supertoken');
    sessionStorage.removeItem('sup-id');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('iid');
    sessionStorage.removeItem('instituteName');
    setIID(null);
    setIsDummy(null);
    setSupertoken(null);
    setSuperUser(null);
  }, []);


  useEffect(() => {
    getAccType();
  }, []) 

  useEffect(() => {
    const role = sessionStorage.getItem('role');

    if (role !== 'student') {
      toast.error("Error 401: Unauthorized Role!");
      navigate('/teacher');
    }
    
    if (loading) return;
    if (!token) navigate('/home');

    const handleWindowResize = () => {
      var mobile = false
      if (window.innerWidth <= 800) mobile = true;
      else setToggle(false);
      setWindowSize([window.innerWidth, mobile]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [loading, token, navigate]);

  const element = useRoutes(routes);

  // useEffect(() => {
  //   if (windowSize[1]) {
  //     toast("Apply the code 'TRIALEXPO' and enjoy full premium features for 7 days!", {
  //       icon: <IoMdPricetags className="text-6xl" />
  //     });
  //   }
  // }, [windowSize[1]])

  return (
    <div className="overflow-hidden flex" style={{ height: "100vh" }}>
      { windowSize[1] ? <Sidebar mobile={windowSize[1]} toggle={toggle} setToggle={setToggle} /> : <></>}
        <div className='flex-grow-1 d-flex flex-column'>
          { windowSize[1] ? <></> : <HorizontalNav /> }
          <nav className={`w-100 fixed z-30 text-white bg-color-blue ${windowSize[1] ? "d-flex align-items-center" : "d-none"}`}>
            <button className="btn text-white d-flex align-items-center"
              style={{ borderRadius: "0" }}
              onClick={() => { if (windowSize[1]) setToggle(!toggle)}}>
              <GiHamburgerMenu />
            </button>
            <span className="vr"></span>
            <span className='mx-3 d-flex flex-grow-1 justify-content-between align-items-center'>
              <span className="text-sm">EduTech</span>
            </span>
          </nav>
          <div id="mainboard" className={`h-100 flex flex-col position-relative overflow-y-auto ${windowSize[1] ? 'pt-10' : ''}`}>
            {plan ? 
            <>
              <ExpiryBar />
              <Popup />
              <PromoCode />
              {element}
            </> : <Processing />}
          </div>
        </div>
    </div>
  );
}

export default StudentPanel;