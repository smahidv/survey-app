import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "./axios";
import { userStateContext } from "../contexts/ContextProvider";

const Signup = () => {
    const { setCurrentUser, setUserToken } = userStateContext();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState({ __html: "" });

    const onSubmit = (ev) => {
        ev.preventDefault();
        setError({ __html: "" });
        axiosClient
            .post("/signup", {
                name: fullName,
                email,
                password,
                password_confirmation: passwordConfirmation,
            })

            .then(({ data }) => {
                setCurrentUser(data.user);
                setUserToken(data.token);
            })

            .catch((error) => {
                if (error.response) {
                    //reduce -> convert array of arrays into a single array
                    const finalErrors = Object.values(
                        error.response.data.errors
                    ).reduce((accum, next) => [...accum, ...next], []);
                    console.log(finalErrors);
                    setError({ __html: finalErrors.join("<br>") });
                }
                console.log(error); //axioserror
            });
    };

    return (
        <>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign up to your account
            </h2>
            <p className="text-center mt-8 font-bold">
                Or{" "}
                <Link to="/login" className="text-blue-700">
                    Login with your account
                </Link>
            </p>

            {error.__html && (
                <div
                    className="bg-red-500 rounded py-2 px-3 text-white"
                    dangerouslySetInnerHTML={error}
                ></div>
            )}

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    onSubmit={onSubmit}
                    className="space-y-6"
                    action="#"
                    method="POST"
                >
                    <div>
                        <label
                            htmlFor="Full-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Full Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="Full-name"
                                name="Full-name"
                                type="Full-name"
                                autoComplete="Full-name"
                                required
                                value={fullName}
                                onChange={(ev) => setFullName(ev.target.value)}
                                className="block w-full rounded-md bord-confirmationer-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                className="block w-full rounded-md bord-confirmationer-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                className="block w-full rounded-md bord-confirmationer-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password-confirmation"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password Confirmation
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password-confirmation"
                                name="password-confirmation"
                                type="password"
                                autoComplete="current-password-confirmation"
                                required
                                value={passwordConfirmation}
                                onChange={(ev) =>
                                    setPasswordConfirmation(ev.target.value)
                                }
                                className="block w-full rounded-md bord-confirmationer-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signup;
