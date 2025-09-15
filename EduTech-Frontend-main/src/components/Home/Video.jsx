import { useEffect, useRef, useState } from 'react';

const Video = () => {
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef();

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            observerOptions
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <div ref={videoRef} id="video" className={`w-full linear-bg flex justify-center py-10 ${
            isVisible ? 'animate__animated animate__fadeInUp' : 'opacity-0'
        }`}>
            <div
                className={`overflow-hidden w-[80%] aspect-video self-center rounded-[30px]`}
            >
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/l3elj_OWhi8?si=ipKh9EBMdnmb_8rY"
                    title="Meridian EduLearn Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default Video;