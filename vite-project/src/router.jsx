import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Surveys from "./views/Surveys";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import SurveyView from "./views/SurveyView";
import SurveyPublicView from "./views/SurveyPublicView";

const router = createBrowserRouter([

    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            // {
            //     path: "/dashboard",
            //     element: <Navigate to="/" />,
            // },
            // if a user navigates to "/dashboard," they would be immediately redirected to the root path
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/surveys",
                element: <Surveys />,
            },
            {
                path: "/surveys/create",
                element: <SurveyView />,
            },
            {
                path: "/surveys/:id",
                element: <SurveyView />,
            },
        ],
    },

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
       path: "/survey/public/:slug",
        element:<SurveyPublicView/>
    }
]);
export default router;
