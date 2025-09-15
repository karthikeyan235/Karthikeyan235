import MeridianLogo from '../assets/meridian_logo_white.png';

const InstituteFooter = () => {
    const instName = sessionStorage.getItem("instituteName");
    
    return (
        <div className="rounded-t-[30px] text-white items-center text-2xl py-3 flex justify-center h-[100px] overflow-hidden bg-contain bg-bottom bg-no-repeat w-screen bg-[#2E5BFF]">
            {instName === 'Meridian Solutions Trial' ? <img src={MeridianLogo} className='object-contain max-w-[250px]' alt="Meridian Logo" /> : instName}
        </div>
    )
}

export default InstituteFooter;