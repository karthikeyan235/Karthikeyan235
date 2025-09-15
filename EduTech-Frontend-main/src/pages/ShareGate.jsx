import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";


const ShareGate = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { bid, qid } = useParams();

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            toast.error("Please login / register user!");
            if (bid) {
                navigate(`/register/book/${bid}`);
            } else if (qid) {
                navigate(`/register/quiz/${qid}`);
            }
        } else {
            if (bid) {
                navigate(`/${sessionStorage.getItem('role')}/book/${bid}`);
            } else if (qid) {
                navigate(`/${sessionStorage.getItem('role')}/quiz/${qid}`);
            }
        }
    }, [bid, qid]);

    return (
        <div className="text-xl gap-y-3 md:text-4xl px-4 text-center w-screen h-screen flex flex-col items-center justify-center">
            <p>Please Wait...</p>
        </div>
    )
}

export default ShareGate;