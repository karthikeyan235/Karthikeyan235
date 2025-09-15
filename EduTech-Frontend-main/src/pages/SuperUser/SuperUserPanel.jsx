import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate, useRoutes } from "react-router-dom";
import Sidebar from "../../components/SuperUserPanel/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import HorizontalNav from "../../components/SuperUserPanel/HorizontalNav";
import { SuperUserContext }from '../../contexts/SuperUserContext';
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import Processing from "../../components/Processing";
import Loader from '../../components/Loader';
import { getAPI, postAPI } from "../../caller/axiosUrls";
// import SchemaEditor from "./SchemaEditor";
import Users from "./Users";
// import PortalConfig from "./PortalConfig";
import Modal from 'react-bootstrap/Modal';
import Profile from './Profile';
 
const SuperUserPanel = () => {
  const { i18n,t } = useTranslation();
  const { supertoken, loading, setIsDummy } = useContext(SuperUserContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [registeredInst, setRegisteredInst] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [sender, setSender] = useState(false);
  const [instituteId, setInstituteId] = useState(sessionStorage.getItem('instituteId'));
  const [instituteName, setInstituteName] = useState(sessionStorage.getItem('instituteName'));
 
  const navigate = useNavigate();
  let debounceTimeout;
 
  const [windowSize, setWindowSize] = useState([window.innerWidth, (window.innerWidth < 800) ? true : false]);
  const [toggle, setToggle] = useState(false);
 
  const routes = [
    {
      path: '',
      element: <Navigate to="/superuser/dashboard" />,
    },
    {
      path: 'dashboard',
      element: <Users registeredInst={registeredInst} />
    },
    // {
    //   path: 'schema',
    //   element: <SchemaEditor />
    // },
    // {
    //   path: 'config',
    //   element: <PortalConfig />
    // },
    {
      path: 'profile',
      element: <Profile registeredInst={registeredInst} />
    },
    {
      path: "*",
      element: <Navigate to='/superuser/dashboard' />
    }
  ];
 
  const handleSelect = (name) => {
    setQuery(name);
    setResults([]);
  }
 
  const registerInstitute = async () => {
    if (query.length === 0) {
      toast(t('ppain'), { icon: '⚠️' });
      return;
    }
  
    if (sender) return;
    setSender(true);
  
    try {
      const response = await postAPI('/superuser/register-institute', { InstituteName: query });
      sessionStorage.setItem('iid', response.instituteId);
      sessionStorage.setItem('instituteName', response.instituteName);
      setInstituteId(response.instituteId);
      setInstituteName(response.instituteName);
      setRegisteredInst(true);
      toast.success(response.message);
  
      // Fetch institute data immediately after registering
      await getSuperData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  };
  
 
  const handleSearch = async (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
 
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
 
    // Fetch results when the query is longer than 2 characters
    debounceTimeout = setTimeout(async () => {
      setResults([]);
      if (searchQuery.length > 2) {
        // Fetch results when the query is longer than 2 characters
        const response = await getAPI(
          `/superuser/universities?name=${searchQuery}`
        );
        setResults(response.results);
      } else {
        setResults([]); // Clear results if query is less than 2 characters
      }
    }, 300);
  };
 
  const getSuperData = async () => {
    setLoadingPage(true); // Ensure loading state is set before starting the fetch
    try {
      const response = await getAPI('/superuser/getInstitute');
      if (response.isCreated) {
        setRegisteredInst(true);
        sessionStorage.setItem('iid', response.instituteId);
        sessionStorage.setItem('instituteName', response.instituteName);
        setInstituteId(response.instituteId);
        setInstituteName(response.instituteName);
        setIsDummy(response.isDummy);
      } else {
        setRegisteredInst(false);
        sessionStorage.removeItem('iid');
        sessionStorage.removeItem('instituteName');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPage(false); // Ensure loading is toggled off even if an error occurs
    }
  };
  
 
  useEffect(() => {
    if (loading) return;
    if (!supertoken) navigate('/home');
  }, [navigate]);
 
  useEffect(() => {
    // Only call getSuperData when `loading` is false and `supertoken` exists
    if (!loading && supertoken) {
      getSuperData();
    }
  }, [loading, supertoken]); // Ensure dependencies are correctly set
  
 
  useEffect(() => {
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
  }, [])
 
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
              <span className="text-sm">{t('edutech')}</span>
            </span>
          </nav>
          <div id="mainboard" className={`h-100 flex flex-col position-relative bg-color overflow-y-auto ${windowSize[1] ? 'pt-10' : 'py-3'}`}>
            {!loadingPage ?
            <>
              {!registeredInst ? <div className="fixed bg-black w-screen opacity-50 h-screen top-0 left-0 z-30"></div> : null}
              <Modal
                show={!registeredInst}
                backdrop="static"
                keyboard={false}
                className="z-40"
                centered
                scrollable
              >
                <Modal.Header>
                    <Modal.Title>{t('registerinstitute')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col h-[400px] items-center w-11/12 gap-y-4 flex mx-auto">
                      {sender ? <Loader type={1} text={t('loading...')} /> :
                      <>
                        <h2 className="font-semibold self-start">{t('ein')}</h2>
                        <div className="flex gap-x-3 w-full">
                          <input
                            type="text"
                            value={query}
                            disabled={sender}
                            onChange={handleSearch}
                            placeholder={t('tain')}
                            className="form-control"
                          />
                          <button onClick={registerInstitute} disabled={sender} className="custom-btn py-2 rounded shadow-none w-[150px] border">
                            {t('register')}
                          </button>
                        </div>
 
                        <ul className="flex flex-col pb-4 w-full gap-y-1">
                          {results.length > 0 ? (
                            results.map((university, index) => (
                              <li key={index} className="border hover:bg-blue-500 hover:text-white cursor-pointer rounded truncate px-3 py-2" onClick={() => handleSelect(university.name)}>{university.name} - ({university.country})</li>
                            ))
                          ) : null}
                        </ul>
                      </>}
                    </div>
                </Modal.Body>
              </Modal>
              {element}
            </> : <Processing />}
          </div>
        </div>
    </div>
  );
}
 
export default SuperUserPanel;
