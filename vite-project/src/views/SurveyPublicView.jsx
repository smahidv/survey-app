import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "./axios";
import PublicQuestionView from "../components/PublicQuestionView";

const SurveyPublicView = () => {
    const answers = {};
    const [Survey, setSurvey] = useState({ questions: [] });
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const [surveyFinished, setSurveyFinished] = useState(false);
    const [isActive, setIsActive] = useState("");

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/survey/get-by-slug/${slug}`)
            .then((res) => {
                setLoading(false);
                setSurvey(res.data.data);
            })
            .catch((err) => {
                if (err.response) {
                    setIsActive(err.response.data);
                }
                console.log(err.response.data);
            });
    }, []);
    function answerChanged(question, value) {
        answers[question.id] = value; // the value is the answer input
    }
    function onSubmit(ev) {
        ev.preventDefault();

        console.log(answers); // {41: "because ", 42: 'good', 43: '12'}

        axiosClient
            .post(`/survey/${Survey.id}/answer`, {
                answers,
            })
            .then(() => {
                setSurveyFinished(true);
            });
    }

    return (
        <div>
           {isActive && (
                    <div
                        className="bg-red-500 rounded py-2 px-3 text-white"
                       
                        
                    >{isActive}</div>
                )}
            {loading && !isActive && <div className="flex justify-center">Loading...</div>}

            {!loading && (
                <form
                    onSubmit={(ev) => onSubmit(ev)}
                    className="container mx-auto p-4"
                >
                    {/* <pre>{JSON.stringify(answers, undefined, 2)}</pre> */}

                    <div className="grid grid-cols-6">
                        <div className="mr-4">
                            <img src={Survey.image_url} alt="" />
                        </div>
                        <div className="col-span-5">
                            <h1 className="text-3xl mb-3">{Survey.title}</h1>
                            <p className="text-gray-500 text-sm mb-3">
                                Expire Date: {Survey.expire_date}
                            </p>
                            <p className="text-gray-500 text-sm mb-3">
                                {Survey.description}
                            </p>
                        </div>
                    </div>
                    {surveyFinished && (
                        <div className="py-8 px-6 bg-emerald-500 text-white w-[600px] mx-auto">
                            Thank you for participating in the survey
                        </div>
                    )}
                    {!surveyFinished && (
                        <>
                            <div>
                                {Survey.questions.map((question, index) => (
                                    <PublicQuestionView
                                        key={question.id} // unique to identify which item has been changed
                                        question={question}
                                        index={index} // provide the position of the current id
                                        answerChanged={(val) =>
                                            answerChanged(question, val)
                                        }
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
};

export default SurveyPublicView;
