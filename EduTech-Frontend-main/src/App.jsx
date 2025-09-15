import './App.css';
import './ChartConfig'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, useContext } from 'react';

// Pages
import TeacherDashboard from './pages/TeacherPanel/TeacherPanel';
import StudentDashboard from './pages/StudentPanel/StudentPanel';
import SuperUserPanel from './pages/SuperUser/SuperUserPanel';
import Home from './pages/Home';
import Logout from './pages/Logout';
import Register from './pages/Register';
import SuperUserLogin from './pages/SuperUser/SuperUserLogin';
import Join from './pages/Join';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import { PlanContext } from './contexts/PlanContext';
import AttendQuiz from './pages/StudentPanel/AttendQuiz';
import TestPanel from './pages/StudentPanel/TestPanel';
import QuestionAnswerPanel from './pages/StudentPanel/QuizAnswerPanel';
import ShareGate from './pages/ShareGate';

// Components
import LoaderEdu from './components/LoaderEdu';
import AdaptiveResult from './pages/StudentPanel/AdaptiveResult';

function App() {
  const [loading, setLoading] = useState(sessionStorage.getItem("loader") !== "1");
  const { plan } = useContext(PlanContext);

  function BadgeHandler() {
    const location = useLocation();
  
    useEffect(() => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          const badge = document.querySelector('.grecaptcha-badge');
          if (badge) {
            if (location.pathname.includes('/register')) {
              badge.style.display = 'flex'; // Show badge
            } else {
              badge.style.display = 'none'; // Hide badge
            }
          }
        });
      }
    }, [location]);
  
    return null;
  }

  useEffect(() => {
    const handleLoad = (force = false) => {
      const loader = document.getElementById('preloader');

      if (loader || force) {
        setTimeout(() => {
          loader?.classList.add('fadeout');
        }, 3000); // Add fadeout after 3 seconds

        setTimeout(() => {
          setLoading(false); // Disable loading after fadeout completes
          sessionStorage.setItem("loader", 1);
        }, 4000); // Ensure preloader is fully hidden after 4 seconds
      } else {
        // Fallback if loader not found, ensure loading state resets
        setLoading(false);
      }
    };

    window.addEventListener('load', handleLoad);

    const finalTimer = setTimeout(() => {
      handleLoad(true);
    }, 3000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(finalTimer);
    };
  }, []);

  return (
    <Router>
      {loading && <LoaderEdu />}
      <Toaster position="top-right" reverseOrder={true} />
      <BadgeHandler /> {/* Handles the visibility of the badge */}
      <Routes>
        <Route path="/superuser/*" element={<SuperUserPanel />} />
        <Route path="/teacher/*" element={<TeacherDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/student/summary" element={<QuestionAnswerPanel />} />
        <Route path="/student/quiz-attend/:qid/*" element={plan === 'trial' ? <AttendQuiz /> : <TestPanel />} />
        <Route path="/student/adaptive-quiz/:qid/*" element={plan === 'trial' ? <AttendQuiz /> : <TestPanel adaptive={true} />} />
        <Route path="/student/adaptive-quiz/result" element={<AdaptiveResult />} />
        <Route path="/join/:iid/:key?" element={<Join />} />
        <Route path="/share/book/:bid" element={<ShareGate />} />
        <Route path="/share/quiz/:qid" element={<ShareGate />} />
        <Route path="/home/:page?" element={<Home />} />
        {/* Learner Registration/Login Routes */}
        <Route path="/register/learners" element={<StudentLogin />} />
        <Route path="/register/learners/quiz/:qid" element={<StudentLogin />} />
        <Route path="/register/learners/book/:bid" element={<StudentLogin />} />
        <Route path="/register/learners/:iid?/:key?" element={<StudentLogin />} />

        {/* Teacher Registration/Login Routes */}
        <Route path="/register/teachers" element={<TeacherLogin />} />
        <Route path="/register/teachers/quiz/:qid" element={<TeacherLogin />} />
        <Route path="/register/teachers/book/:bid" element={<TeacherLogin />} />
        <Route path="/register/teachers/:iid?/:key?" element={<TeacherLogin />} />

        {/* Admin/SuperUser Registration/Login */}
        <Route path="/register/admin" element={<SuperUserLogin />} />

        {/* General Register Routes with ID/Key (Avoid conflicts with specific routes) */}
        <Route path="/register/quiz/:qid" element={<Register />} />
        <Route path="/register/book/:bid" element={<Register />} />
        <Route path="/register/:iid?/:key?" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;