import { useEffect, useState } from "react";
import { getAPI } from "../caller/axiosUrls";
import Marquee from "react-fast-marquee";
import toast from 'react-hot-toast';

const ExpiryBar = () => {
    const [expired, setExpired] = useState(false);

    const checkExpiry = async () => {
        try {
            const response = await getAPI('/users/getUserExpiry');
            setExpired(response.isExpired);
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        checkExpiry();
    }, [])
    
    return (
        <div className={`${expired ? 'min-h-[50px]' : 'h-0'} overflow-hidden flex justify-center font-semibold items-center bg-yellow-400`}>
            <Marquee>User plan has expired! Please try to contact administrator.</Marquee>
        </div>
    )
}

export default ExpiryBar;