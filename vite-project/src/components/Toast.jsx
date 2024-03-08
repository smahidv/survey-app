import React from "react";
import { userStateContext } from "../contexts/ContextProvider";

const Toast = () => {
    const { toast } = userStateContext();

    return (
        <>
            {toast.show && (
                <div className="w-[300px] py-2 px-2 text-white rounded bg-emerald-500 fixed right-4 bottom-4 z-50 animate-fade-out-left ">
                    {toast.message}
                </div>
            )}
        </>
    );
};

export default Toast;
