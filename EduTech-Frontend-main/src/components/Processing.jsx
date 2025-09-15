import { Puff } from 'react-loader-spinner'
import { useTranslation } from 'react-i18next';

const Processing = () => {
    const { i18n,t } = useTranslation();
    return (
        <div className="fixed z-40 bg-black/85 w-screen h-screen top-0 left-0 flex flex-col justify-center items-center"> 
            <div className='bg-white p-4 rounded-[30px] flex flex-col justify-center items-center'>
                <dotlottie-player
                    src="https://lottie.host/4940a77f-a65b-4210-bcaa-3ccebdbcbccd/7khoFN6KvM.json"
                    background="transparent"
                    border="2px solid black"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: '50px', height: '50px' }}
                ></dotlottie-player>
            </div>
            <p className='text-3xl text-white mt-4'>{t('processing')}</p>
        </div>
    )
}

export default Processing;