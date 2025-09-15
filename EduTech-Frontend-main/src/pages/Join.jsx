import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { postAPI } from "../caller/axiosUrls";
import { useTranslation } from "react-i18next";


const Join = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { iid, key } = useParams();

    const handleJoin = async () => {
        if (key && iid) {
            await teacherJoin();
        } else if (iid) {
            await studentJoin();
        }
    }

    const studentJoin = async () => {
        try {
            const response = await postAPI(`/superuser/joinInstitute?inst_id=${iid}`);
            sessionStorage.setItem('role', 'student');
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            navigate('/student');
        }
    }

    const teacherJoin = async () => {
        try {
            const response = await postAPI(`/superuser/joinInstitute?inst_id=${iid}&key=${key}`);
            sessionStorage.setItem('role', 'teacher');
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            navigate('/teacher');
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            toast.error("Please login / register user!");
            if (key && iid) {
                navigate(`/register/teachers/${iid}/${key}`);
            } else if (iid) {
                navigate(`/register/learners/${iid}`);
            }
        } else {
            handleJoin();
        }
    }, [key, iid]);

    useEffect(() => {
        sessionStorage.removeItem('adpid');
        sessionStorage.removeItem('first');
        sessionStorage.removeItem("adaptiveResult");
    })

    return (
        <div className="text-xl gap-y-3 md:text-4xl px-4 text-center w-screen h-screen flex flex-col items-center justify-center">
            <p>{t('ji...')}</p>
            <p>({iid})</p>
        </div>
    )
}

export default Join;