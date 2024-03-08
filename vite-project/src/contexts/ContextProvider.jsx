import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    setCurrentUser: () => {},
    surveys: [],
    questionTypes: [],
    userToken: null,
    setUserToken: () => {},
    toast: {
        message: null,
        show: false,
    },
});

export const ContextProvider = ({ children }) => {
    const [userToken, _setUserToken] = useState(
        localStorage.getItem("TOkEN") || ""
    );
    const [currentUser, _setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("currentUser")) || {}
    );

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

    const [toast, setToast] = useState({ message: "", show: false });

    const showToast = (message) => {
        setToast({ message, show: true });
        setTimeout(()=>{
            setToast({ message:'', show: false });
        },2000)
    };

    return (
        <StateContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                userToken,
                setUserToken,
                questionTypes,
                toast,
                showToast,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const userStateContext = () => useContext(StateContext);
