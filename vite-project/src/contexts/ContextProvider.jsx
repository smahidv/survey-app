import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    setCurrentUser: () => {},
    surveys: [],
    questionTypes: [],
    userToken: null,
    setUserToken: () => {},
});

const tmpSurveys = [
    {
        id: 1,
        image_url:
            "data:image/png;base64,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",
        title: "TheCodeholic YouTube channel",
        slug: "thecodeholic-youtube-channel",
        status: true,
        description:
            "My name is Zura.<br>I am Web Developer with 9+ years of experience, free educational content creator, CTO, Lecturer and father of two wonderful daughters.<br><br>The purpose of the channel is to share my several years of experience with beginner developers.<br>Teach them what I know and make my experience as a lesson for others.",
        created_at: "2022-01-07 13:23:41",
        updated_at: "2022-01-18 16:34:19",
        expire_date: "2022-01-23",
        questions: [
            {
                id: 15,
                type: "text",
                question: "From which country are you?",
                description: null,
            },
            {
                id: 16,
                type: "checkbox",
                question:
                    "Which language videos do you want to see on my channel?",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
                data: {
                    options: [
                        {
                            uuid: "8ee03188-9e7e-44e5-9176-7574c0beec6f",
                            text: "JavaScript",
                        },
                        {
                            uuid: "fe9497f2-8f05-4c82-9586-26e36736fa9e",
                            text: "PHP",
                        },
                        {
                            uuid: "db0f194c-d32d-4e19-929e-08f7b4e2bcc0",
                            text: "HTML + CSS",
                        },
                        {
                            uuid: "93273c4c-ac8f-432e-b847-e467df64ab9c",
                            text: "All of the above",
                        },
                        {
                            uuid: "d54818a7-ad7e-4b69-9287-16a8dc50a6cb",
                            text: "Everything Zura thinks will be good",
                        },
                    ],
                },
            },
            {
                id: 17,
                type: "select",
                question:
                    "Which PHP framework videos do you want to see on my channel?",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
                data: {
                    options: [
                        {
                            uuid: "fb907cfe-b7a1-4b24-86fb-03f9c44aa710",
                            text: "Laravel",
                        },
                        {
                            uuid: "e2629262-93ca-4a7a-8129-19c765664a04",
                            text: "Yii2",
                        },
                        {
                            uuid: "9a11a425-d9fe-4fe9-86af-bb814e3d9271",
                            text: "Codeigniter",
                        },
                        {
                            uuid: "484268b1-d3aa-47f8-a185-356ed48e50fe",
                            text: "Symfony",
                        },
                    ],
                },
            },
            {
                id: 18,
                type: "radio",
                question: "Which Laravel Framework do you love most?",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
                data: {
                    options: [
                        {
                            uuid: "c02e50e6-5ebf-4344-9822-baa16502dbdb",
                            text: "Laravel 5",
                        },
                        {
                            uuid: "90a15aae-ef4c-4d04-aa05-8e840d4a2ded",
                            text: "Laravel 6",
                        },
                        {
                            uuid: "93c64532-c1eb-4bfd-bd00-ab51cafdee78",
                            text: "Laravel 7",
                        },
                        {
                            uuid: "51f6a704-7a86-47a4-9b2d-72bb026a3371",
                            text: "Laravel 8",
                        },
                    ],
                },
            },
            {
                id: 19,
                type: "checkbox",
                question:
                    "What type of projects do you want to see on my channel built with Laravel?",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cumque earum eos esse est ex facilis, iure laboriosam maiores neque nesciunt nulla placeat praesentium quae quos ratione, recusandae totam velit!",
                data: {
                    options: [
                        {
                            uuid: "c5519ab0-3282-4758-a34b-506052bf1342",
                            text: "REST API",
                        },
                        {
                            uuid: "dfbbc0af-8fff-44ae-be36-e85270041729",
                            text: "E-commerce",
                        },
                        {
                            uuid: "6940c122-505f-4d9d-a103-472f923fad94",
                            text: "Real Estate",
                        },
                        {
                            uuid: "2b3c12a4-8f3c-4276-ae59-4e9d55e849be",
                            text: "All of the above",
                        },
                    ],
                },
            },
            {
                id: 22,
                type: "textarea",
                question: "What do you think about TheCodeholic channel?",
                description:
                    "Write your honest opinion. Everything is anonymous.",
                data: [],
            },
            {
                id: 23,
                type: "text",
                question: "Which channel is your favorite one?",
                description: null,
                data: [],
            },
        ],
    },
    {
        id: 2,
        image_url:
            "data:image/png;base64,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",
        title: "React",
        slug: "react",
        status: true,
        description:
            "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
        created_at: "2022-01-07 08:50:40",
        updated_at: "2022-01-07 13:37:37",
        expire_date: "2022-02-01",
        questions: [],
    },
    {
        id: 3,
        image_url:
            "data:image/png;base64,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",
        title: "Laravel 9",
        slug: "laravel-9",
        status: true,
        description:
            "Laravel is a web application framework with expressive, elegant syntax. We\u2019ve already laid the foundation \u2014 freeing you to create without sweating the small things.",
        created_at: "2022-01-07 13:28:56",
        updated_at: "2022-01-07 13:28:56",
        expire_date: "2022-01-20",
        questions: [],
    },
];
export const ContextProvider = ({ children }) => {
    const [userToken, _setUserToken] = useState(
        localStorage.getItem("TOkEN") || ""
    );
    const [currentUser, _setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("currentUser")) || {}
    );

    const [surveys, setsurveys] = useState(tmpSurveys);
    const [questionTypes] = useState([
        "text",
        "select",
        "radio",
        "checkbox",
        "textarea",
    ]);



    //_setUserToken: Is a function used to update the state.
    //setUserToken(token): Is a function you can call to update the state with a new value (token).
    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem("TOkEN", token);
        } else {
            localStorage.removeItem("TOkEN");
        }
        _setUserToken(token);
    };
    const setCurrentUser = (user) => {
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("currentUser");
        }
        _setCurrentUser(user);
    };

    return (
        <StateContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                userToken,
                setUserToken,
                surveys,
                questionTypes,

            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const userStateContext = () => useContext(StateContext);
