import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

const AdaptiveResult = () => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        sessionStorage.removeItem("first");
        sessionStorage.removeItem("adpid");
        const result = JSON.parse(sessionStorage.getItem("adaptiveResult"));
        if (!result) window.location.href='/student';
        else setResult(result);
    })

    return (
        <div className="flex flex-col w-screen text-white h-screen justify-center items-center">
            <p className="text-4xl text-black mb-4 flex items-center gap-x-5"><IoIosArrowBack onClick={() => location.href="/student"} className="cursor-pointer text-black w-[50px] h-[50px]" /> Adaptive Quiz Result</p>
            <div className="flex flex-col justify-center items-center custom-gradientBG w-[90%] h-3/4 rounded-[30px]">
                <div className="grow w-full flex justify-center items-center">
                    <div className="grow flex flex-col w-full h-full items-center">
                        <p className="text-6xl mt-5">Easy</p>
                        <div className="flex flex-col gap-y-2 w-full">
                            <div className="w-full justify-between flex mt-4 px-[100px]">
                                <p>Accuracy:</p>
                                <p>{result?.easy.accuracy}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Attempted:</p>
                                <p>{result?.easy.attempted}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Right:</p>
                                <p>{result?.easy.right}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Wrong:</p>
                                <p>{result?.easy.wrong}</p>
                            </div>
                        </div>
                    </div>
                    <div className="vr" />
                    <div className="grow flex flex-col w-full h-full items-center">
                        <p className="text-6xl mt-5">Medium</p>
                        <div className="flex flex-col gap-y-2 w-full">
                            <div className="w-full justify-between flex mt-4 px-[100px]">
                                <p>Accuracy:</p>
                                <p>{result?.medium.accuracy}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Attempted:</p>
                                <p>{result?.medium.attempted}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Right:</p>
                                <p>{result?.medium.right}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Wrong:</p>
                                <p>{result?.medium.wrong}</p>
                            </div>
                        </div>
                    </div>
                    <div className="vr" />
                    <div className="grow flex flex-col w-full h-full items-center">
                        <p className="text-6xl mt-5">Hard</p>
                        <div className="flex flex-col gap-y-2 w-full">
                            <div className="w-full justify-between flex mt-4 px-[100px]">
                                <p>Accuracy:</p>
                                <p>{result?.hard.accuracy}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Attempted:</p>
                                <p>{result?.hard.attempted}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Right:</p>
                                <p>{result?.hard.right}</p>
                            </div>
                            <div className="w-full justify-between flex px-[100px]">
                                <p>Wrong:</p>
                                <p>{result?.hard.wrong}</p>
                            </div>
                        </div>
                    </div>
                    <div className="vr" />
                </div>
                <div className="grow flex justify-between px-5 items-center w-full border-t">
                    <p className="text-6xl">Overall</p>
                    <div className="flex flex-col items-center">
                        <p>Accuracy</p>
                        <p>{result?.overall.accuracy}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p>Total Attempted</p>
                        <p>{result?.overall.totalAttempted}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p>Total Right</p>
                        <p>{result?.overall.totalRight}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p>Total Wrong</p>
                        <p>{result?.overall.totalWrong}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdaptiveResult;