import { useState, useEffect } from 'react';
import Circle from '../../assets/Circle.png';
import Arrow from '../../assets/Arrow.png';
import { useParams } from 'react-router-dom';

const ScrollToTop = () => {
  // State to track whether the scroll position is greater than 10px
  const [isVisible, setIsVisible] = useState(false);

  const { page } = useParams();

  useEffect(() => {
    if (page) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page])

  // Set up scroll event listener
  useEffect(() => {
    const handleScroll = () => {
        
        // Show button only if scrolled more than 10px
        if (window.scrollY > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top when clicked
  const handleScrollToTop = () => {
    const scrolTop = document.getElementById("scrolltop");
    scrolTop.classList.remove("up");
    scrolTop.classList.add("up");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Only render the ScrollToTop button if isVisible is true
    isVisible && (
      <div 
        id="scrolltop"
        className="fixed hover:scale-105 bottom-20 right-20 w-[50px] h-[50px] cursor-pointer" 
        onClick={handleScrollToTop}
      >
        <img 
          className="absolute rounded-full border-[1px] border-[#2E5BFF] top-0 left-0 w-full h-full" 
          src={Circle} 
          alt="Scroll To Top Circle" 
        />
        <img 
          className="absolute top-1/2 w-[16px] h-[30px] left-1/2 -translate-x-1/2 -translate-y-1/2" 
          src={Arrow} 
          alt="Scroll To Top Arrow" 
        />
      </div>
    )
  );
};

export default ScrollToTop;