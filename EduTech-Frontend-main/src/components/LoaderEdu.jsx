import { useTranslation } from 'react-i18next';

const LoaderEdu = () => {
    const { i18n, t } = useTranslation();
    return (
        <div id="preloader" className="fixed z-50 bg-white w-screen h-screen top-0 left-0 flex flex-col justify-center items-center"> 
            <p className="text-[220px] w-full h-full text-center leading-none preloader-text font-bold">
                <span className="moving-text">Edulearn.ai</span>
            </p>
        </div>
    );
};

export default LoaderEdu;