import { useNavigate } from "react-router-dom";
 
const QuizCard = ({ quiz, type, adaptive, attend = false }) => {
    const navigate = useNavigate();
 
    return (
        <div className="flex flex-col hover:scale-105 items-center">
            {/* Quiz Card */}
            <div
                onClick={() => navigate(attend ? (adaptive ? `/${type}/adaptive-quiz/${quiz.quizID}` : `/${type}/quiz-attend/${quiz.quizID}`) : `/${type}/quiz/${quiz.quizID}`)}
                className="relative w-[270px] h-[230px] flex items-end justify-center rounded-2xl bg-gray-200 cursor-pointer"
            >
                <img
                className="w-full h-full rounded-2xl object-cover object-center"
                src={quiz?.coverImage}
                alt={quiz.quizName}
                />
            </div>
        
            {/* Quiz Name Below the Card */}
            <p className="text-lg font-semibold mt-2 ml-[-15px] text-start truncate w-11/12">
                {quiz.quizName}
            </p>
        </div>
    );
};
 
export default QuizCard;