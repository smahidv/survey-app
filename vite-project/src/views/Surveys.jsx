import React, { useState } from "react";
import PageComponent from "../components/PageComponent";
import SurveyListItem from "../components/SurveyListItem";
import TButton from "../components/core/TButton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import axiosClient from "./axios";
import Pagination from "../components/Pagination";
import { userStateContext } from "../contexts/ContextProvider";

const Surveys = () => {
    const { showToast } = userStateContext();
    const [surveys, setSurveys] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const onDeleteClick = (id) => {
        if (window.confirm("are you sure you want to delete this survey ?")) {
            axiosClient.delete(`/survey/${id}`).then((res) => {
                getSurveys();
                // setToast({ message: "test", show: true });
                showToast('the survey was deleted')
            });
        }
    };

    const onPageClick = (link) => {
        getSurveys(link.url);
    };

    const getSurveys = (url) => {
        url = url || "/survey";
        setLoading(true);
        // exemple url: 'http://localhost:8000/api/survey?page=1
        axiosClient.get(url).then((data) => {
            setSurveys(data.data.data);
            setLoading(false);
            setMeta(data.data.meta);
        });
    };

    useEffect(() => {
        getSurveys();
    }, []);

    return (
        <PageComponent
            title="Surveys"
            buttons={
                <TButton color="green" to="/surveys/create" on>
                    <PlusCircleIcon className="h-6 w-6 mr-2" />
                    Create new
                </TButton>
            }
        >
            {loading && <div>please wait a moment ...</div>}
            {!loading && (
                <div>
                    {surveys.length === 0 && (
                        <div className="py-8 text-center text-grap-700 ">
                            you don't have surveys created
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {surveys.map((survey) => (
                            <SurveyListItem
                                survey={survey}
                                key={survey.id}
                                onDeleteClick={onDeleteClick}
                            />
                        ))}
                    </div>
                    {surveys.length > 0 && (
                    <Pagination meta={meta} onPageClick={onPageClick} />)
}
                </div>
            )}
        </PageComponent>
    );
};

export default Surveys;
