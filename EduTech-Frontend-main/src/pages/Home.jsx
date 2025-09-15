import React, { useEffect, useContext, useState } from 'react';
import { PricingProvider } from '../contexts/PricingContext';
import Processing from '../components/Processing';
import { SuperUserContext } from '../contexts/SuperUserContext';
import { PlanContext } from '../contexts/PlanContext';
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Clients from '../components/Home/Clients';
import Types from '../components/Home/Types';
import Features from '../components/Home/Features';
import FAQs from '../components/Home/FAQs';
import Video from '../components/Home/Video';
import Footer from '../components/Home/Footer';
import ScrollToTop from '../components/Home/ScrollToTop';
import { useParams, useNavigate } from 'react-router-dom';
import ContactForm from '../components/Home/ContactForm';
import TextSelector from '../components/Home/TextSelector';
import TermsAndConditions from '../components/Home/TermsAndConditions';
import PrivacyPolicy from '../components/Home/PrivacyPolicy';
import CookiesNetwork from '../components/Home/CookiesNetwork';
import RefundPolicy from '../components/Home/RefundPolicy';
import AccountDeletion from '../components/Home/AccountDeletion';
import MobileApp from '../components/Home/MobileApp';

const Home = ({ loading }) => {
  const { setSuperUser, setSupertoken } = useContext(SuperUserContext);
  const { setIsDummy } = useContext(PlanContext);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedText, setSelectedText] = useState(''); // Store selected text
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const [sender, setSender] = useState(false);
  const [element, setElement] = useState('');

  const { page } = useParams();

  const navigate = useNavigate();

  const registerButton = (panel) => {
    const home = document.getElementById("home");
    home.classList.add("fadeout");
    setTimeout(() => {
      navigate(panel)
    }, 1000)
  }

  useEffect(() => {
    if (page === 'TermsAndConditions') setElement(<TermsAndConditions />);
    else if (page === 'CookiesNetwork') setElement(<CookiesNetwork />);
    else if (page === 'PrivacyPolicy') setElement(<PrivacyPolicy />);
    else if (page === 'RefundPolicy') setElement(<RefundPolicy />);
    else if (page === 'AccountDeletion') setElement(<AccountDeletion />);
    else if (page === 'mobileapp') setElement(<MobileApp />);
    else if (page && page.length) navigate('/home');
  }, [page]);

  useEffect(() => {
    sessionStorage.removeItem('supertoken');
    sessionStorage.removeItem('sup-id');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('iid');
    sessionStorage.removeItem('instituteName');
    setIsDummy(null)
    setSupertoken(null);
    sessionStorage.removeItem('adpid');
    sessionStorage.removeItem('first');
    sessionStorage.removeItem("adaptiveResult");
    setSuperUser(null);

    // const hash = window.location.hash;
    // if (hash === '#contact') {
    //   const contactElement = document.getElementById('contact');
    //   if (contactElement) {
    //     contactElement.scrollIntoView({ behavior: 'smooth' });
    //   }
    // }
  }, []);

  // Global Text Selection Handling
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString();

    if (text) {
      const range = selection.getRangeAt(0).getBoundingClientRect();
      setDialogPosition({ top: range.top + window.scrollY, left: range.left });
      setSelectedText(text);
    } else {
      console.log("No Text Selected:"); 
      setSelectedText('');
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  return (
    <PricingProvider>
      {sender ? <Processing /> : null}
      <div id="home" className='w-screen flex flex-col'>
        <Navbar loading={loading} registerButton={registerButton} />
        {
          page ? 
          <div className='py-5 mt-[80px]'>
            { element }
          </div> :
          <>
            <Hero loading={loading} registerButton={registerButton} setShowContactForm={setShowContactForm} />
            <Clients />
            <Types registerButton={registerButton} setShowContactForm={setShowContactForm} />
            <Features registerButton={registerButton} setShowContactForm={setShowContactForm} />
            <FAQs />
            <Video />
            <TextSelector selectedText={selectedText} dialogPosition={dialogPosition} />
            {showContactForm ? <ContactForm setShowContactForm={setShowContactForm} /> : null}
          </>
        }
        <Footer registerButton={registerButton} />
        <ScrollToTop />
      </div>
    </PricingProvider>
  );
};

export default Home;
