import { useEffect, useRef, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdArrowDropdown } from "react-icons/io";
import { useTranslation } from 'react-i18next'; 

const FAQItem = ({ question, answer, eventKey, isOpen, toggleOpen, isVisible }) => {
  return (
    <div className={`mb-12 w-full ${isVisible ? `animate__animated animate__fadeInLeft animate__delay-${parseInt(eventKey, 10)}s` : 'opacity-0'}`}>
      <div className='flex w-full cursor-pointer justify-between' 
        onClick={() => toggleOpen(eventKey)}
        aria-controls={`faq-collapse-text-${eventKey}`}
        aria-expanded={isOpen}
      >
        <p className='text-[24px] w-[90%] font-medium'>{question}</p>
        <IoMdArrowDropdown
          className={`text-[46px] text-customBlue transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      <div className={`${isOpen ? 'bg-customBlue px-5 py-10 border-[2px] border-white text-white rounded-[30px] faq-shadow opacity-100' : 'opacity-0'}`}>
        <Collapse in={isOpen}>
          <div id={`faq-collapse-text-${eventKey}`}>
            {answer}
          </div>
        </Collapse>
      </div>
    </div>
  );
}

const FAQs = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const faqsRef = useRef();

  const toggleOpen = (key) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const faqs = [
    {
      question: t('wieahdidfc'),
      answer: t('eiaapepfoplsd'),
      eventKey: '1',
    },
    {
      question: t('hdeplfs'),
      answer: t("euaaatclp"),
      eventKey: '2',
    },
    {
      question: t('wieuftaa'),
      answer: t('esobostfesa'),
      eventKey: '3',
    },
    {
      question: t('cearptsoe'),
      answer: t('yeaeartpts'),
      eventKey: '4',
    },
    {
      question: t('wmesoaaet'),
      answer: t('ecplciaat'),
      eventKey: '5',
    },
  ];

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    // Create the IntersectionObserver for the FAQ parent section
    const faqObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          faqObserver.unobserve(entry.target);
        }
      },
      observerOptions
    );

    if (faqsRef.current) {
      faqObserver.observe(faqsRef.current);
    }

    return () => {
      if (faqsRef.current) {
        faqObserver.unobserve(faqsRef.current);
      }
    };
  }, []);

  return (
    <div ref={faqsRef} className={`flex flex-col mb-20 self-center items-center w-9/12`}>
      <p className={`text-[64px] mb-4 font-semibold text-black ${isVisible ? 'animate__animated animate__fadeInDown' : 'opacity-0'}`}>{t('faqs')}</p>
      <span className={`w-[400px] border-[1px] mb-20 border-customBlue ${isVisible ? 'animate__animated animate__zoomIn' : 'opacity-0'}`} />
      {faqs.map((faq) => (
        <FAQItem
          key={faq.eventKey}
          question={faq.question}
          answer={faq.answer}
          eventKey={faq.eventKey}
          isVisible={isVisible}
          isOpen={!!openItems[faq.eventKey]}
          toggleOpen={toggleOpen}
        />
      ))}
    </div>
  );
}

export default FAQs;
