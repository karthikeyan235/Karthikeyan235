import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { getAPI, postAPI } from "../caller/axiosUrls";
import Markdown from 'react-markdown';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import DeleteImage from "../assets/Delete.png";

const NotesPage = () => {
  const { nid } = useParams();
  const [sender, setSender] = useState(true);
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const getNotesInfo = async () => {
    setSender(true);

    try {
      const response = await getAPI(`/notes/get-notes-info?notesId=${nid}`);
      setData(response);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false);
    }
  }

  const deleteNotes = async () => {
    if (sender) return;
    else setSender(true);
    
    try {
      await postAPI(`/notes/delete-note`, {
        notesId: nid
      });
      toast.success("Note/TipSheet deleted successfully!");
      navigate(-1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSender(false); 
    }
  }

  useEffect(() => {
    getNotesInfo();
  }, [nid])

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3 items-center mx-5">
        <div onClick={() => navigate(-1)} className="cursor-pointer hover:scale-110 active:scale-90 flex w-[300px] items-center gap-4">
          <button
            className="w-fit text-4xl"
          >
            <IoIosArrowBack />
          </button>
          <span className="text-3xl font-bold">My Notes</span>
        </div>
        <button
          className={`${
            sender ? "" : "hover:scale-110 active:scale-90"
          } flex flex-col rounded justify-center items-center text-red-400 mb-1`}
            disabled={sender}
            variant="danger"
            onClick={deleteNotes}
          >
            <img
              src={DeleteImage}
              alt="Delete Icon"
              className=""
            />
        </button>
      </div>
      {sender ? <Loader text={"Loading..."} /> : (data ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-4 truncate">{data?.notesName}</h1>
          <div className="bg-gray-100 mx-5 px-5 p-6 rounded-md shadow-md">
            <pre className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
              <Markdown>{data?.llmResponse}</Markdown>
            </pre>
          </div>
        </>
      ) : (
        <p className="text-xl text-red-500 text-center">
          No Data Found. Please navigate correctly!
        </p>
      ))}
    </div>
  );
};

export default NotesPage;
