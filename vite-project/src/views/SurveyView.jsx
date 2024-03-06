import { PhotoIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import TButton from "../components/core/TButton";
import { useState } from "react";
import axiosClient from "./axios";
import { useNavigate, useParams } from "react-router-dom";
import SurveyQuestions from "../components/SurveyQuestions";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

const SurveyView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [survey, setsurvey] = useState({
        title: "",
        slug: "",
        status: false,
        description: "",
        image: null,
        image_url: null,
        expire_date: "",
        questions: [],
    });
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        error_title: "",
        error_expire_date: "",
    });
    const onImageChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        // The load event is fired when a file has been read successfully.
        reader.onload = () => {
            setsurvey({
                ...survey,
                image: file,
                image_url: reader.result,
            });
            ev.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = { ...survey };
        if (payload.image) {
            payload.image = payload.image_url;
        }
        delete payload.image_url;

        let res = null;
        if (id) {
            axiosClient.put("");
        }

        axiosClient
            .post("/survey", payload)
            .then((res) => {
                navigate("/surveys");
            })
            .catch((err) => {
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.errors
                ) {
                    setErrors({
                        error_title: err.response.data.errors.title,
                        error_expire_date: err.response.data.errors.expire_date,
                    });
                } else {
                    console.error("Unexpected error:", err);
                }
                console.log(err, err.response);
            });
    };

    const addQuestion = () => {
        survey.questions.push({
            id: uuidv4(),
            type: "text",
            question: "",
            description: "",
            data: {},
        });
        setsurvey({
            ...survey,
        });
    };

    useEffect(() => {
        setLoading(true);
        if (id) {
            axiosClient.get(`/survey/${id}`).then(({ data }) => {
                setsurvey(data.data);
                setLoading(false);
            });
        }
    }, []);

    function onQuestionsUpdate(questions) {
        setsurvey({
            ...survey,
            questions,
        });
    }

    return (
        <PageComponent
            title={!id ? "Create new Survey" : `update ${survey.title} survey`}
        >
            {/* <pre>{ JSON.stringify(survey, undefined, 2) }</pre> */}
            {/* {loading && <div>loading ...</div>} */}
            {/* {!loading && ( */}
                <form action="#" method="POST" onSubmit={onSubmit}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                            {/*Image*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Photo
                                </label>
                                <div className="mt-1 flex items-center">
                                    {survey.image_url && (
                                        <img
                                            src={survey.image_url}
                                            alt=""
                                            className="w-32 h-32 object-cover"
                                        />
                                    )}
                                    {!survey.image_url && (
                                        <span className="flex justify-center  items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                            <PhotoIcon className="w-8 h-8" />
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <input
                                            type="file"
                                            className="absolute left-0 top-0 right-0 bottom-0 opacity-0"
                                            onChange={onImageChoose}
                                        />
                                        Change
                                    </button>
                                </div>
                            </div>
                            {/*Image*/}

                            {/*Title*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Survey Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={survey.title}
                                    onChange={(ev) =>
                                        setsurvey({
                                            ...survey,
                                            title: ev.target.value,
                                        })
                                    }
                                    placeholder="Survey Title"
                                    className={`mt-1 block w-full rounded-md shadow-sm 
                                focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                    errors.error_title
                                        ? "border-red-500 border-[1px]"
                                        : "border-gray-300 outline-none "
                                }`}
                                />
                                {errors.error_title && (
                                    <small className="text-red-600">
                                        {errors.error_title}
                                    </small>
                                )}
                            </div>

                            {/*Title*/}

                            {/*Description*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 outline-none"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={survey.description || ""}
                                    onChange={(ev) =>
                                        setsurvey({
                                            ...survey,
                                            description: ev.target.value,
                                        })
                                    }
                                    placeholder="Describe your survey"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                            </div>
                            {/*Description*/}

                            {/*Expire Date*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="expire_date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Expire Date
                                </label>
                                <input
                                    type="date"
                                    name="expire_date"
                                    id="expire_date"
                                    value={survey.expire_date}
                                    onChange={(ev) =>
                                        setsurvey({
                                            ...survey,
                                            expire_date: ev.target.value,
                                        })
                                    }
                                    className={`mt-1 block w-full rounded-md outline-none shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                        errors.error_expire_date
                                            ? "border-red-500 border-[1px]"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.error_expire_date && (
                                    <small className="text-red-600">
                                        {errors.error_expire_date}
                                    </small>
                                )}
                            </div>
                            {/*Expire Date*/}

                            {/*Active*/}
                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="status"
                                        name="status"
                                        type="checkbox"
                                        checked={survey.status}
                                        onChange={(ev) =>
                                            setsurvey({
                                                ...survey,
                                                status: ev.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="comments"
                                        className="font-medium text-gray-700"
                                    >
                                        Active
                                    </label>
                                    <p className="text-gray-500">
                                        Whether to make survey publicly
                                        available
                                    </p>
                                </div>
                            </div>
                            {/*Active*/}

                            {/* <pre>{JSON.stringify(survey.questions, undefined, 2)}</pre> */}
                            <button type="button" onClick={addQuestion}>
                                add question
                            </button>
                            <SurveyQuestions
                                questions={survey.questions}
                                onQuestionsUpdate={onQuestionsUpdate}
                            />
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <TButton>{!id ? "save" : "update"}</TButton>
                        </div>
                    </div>
                </form>
            {/* )} */}
        </PageComponent>
    );
};

export default SurveyView;
