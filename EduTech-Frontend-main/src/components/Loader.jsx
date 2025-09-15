import { Puff, ThreeDots } from 'react-loader-spinner'

const Loader = ({ loginPage, type, text }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center"> 
            <div className='bg-white p-4 rounded-[30px] flex flex-col justify-center items-center'>
            {type === 1 ?
            <dotlottie-player
                src="https://lottie.host/4940a77f-a65b-4210-bcaa-3ccebdbcbccd/7khoFN6KvM.json"
                background="transparent"
                border="2px solid black"
                speed="1"
                loop
                autoplay
                style={{ width: '50px', height: '50px' }}
            ></dotlottie-player>
            :  
            <dotlottie-player
                src="https://lottie.host/4940a77f-a65b-4210-bcaa-3ccebdbcbccd/7khoFN6KvM.json"
                background="transparent"
                border="2px solid black"
                speed="1"
                loop
                autoplay
                style={{ width: '50px', height: '50px' }}
            ></dotlottie-player>}
            {text ? <p className='mt-3 font-semibold text-xl'>{text}</p> 
            : null}
            </div>
        </div>
    )
}
export default Loader;