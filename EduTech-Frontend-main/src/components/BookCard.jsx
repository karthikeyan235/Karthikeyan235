import { useNavigate } from "react-router-dom";
 
const BookCard = ({ book, type }) => {
  const navigate = useNavigate();
 
  return (
    <div className="flex flex-col hover:scale-105 items-center">
      {/* Book Card */}
      <div
        onClick={() => navigate(`/${type}/book/${book.bookId}`)}
        className="relative w-[270px] h-[230px] flex items-end justify-center rounded-2xl bg-gray-200 cursor-pointer"
      >
        <img
          className="w-full h-full rounded-2xl object-cover object-center"
          src={book.coverImage}
          alt={book.name}
        />
      </div>
      {/* Book Name Below the Card */}
      <p className="text-lg font-semibold mt-2 ml-[-15px] text-start truncate w-[250px]">
        {book.name}
      </p>
    </div>
  );
};
 
export default BookCard;