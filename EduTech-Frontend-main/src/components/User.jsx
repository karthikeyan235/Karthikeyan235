import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import SignOutButton from "./SignOutButton";

const User = ({ plan, mail, setSender }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    return (
        <div className="relative">
            <span onClick={toggleDropdown} className="font-semibold flex items-center gap-x-2 cursor-pointer text-[40px] leading-0">
                <FaRegUserCircle />
            </span>
            {showDropdown && (
                <div className="z-30 py-3 gap-y-2 absolute flex flex-col bottom-[-160px] right-0 w-[400px] text-[16px] border-[1px] border-white overflow-hidden shadow-md bg-gray-100 items-center rounded-[15px]">
                    <p className="truncate w-full text-center font-semibold">{mail}</p>
                    <p className="text-center text-capitalize">Plan: {plan}</p>
                    <SignOutButton setSender={setSender} />
                </div>
            )}
        </div>
    );
};

export default User;