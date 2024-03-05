import React from "react";

const PageComponent = ({ title, buttons = "", children }) => {
    return (
        <div>
            <header className="bg-white shadow">
                <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="flex w-full justify-between text-3xl font-bold tracking-tight">
                        {title}
                        {buttons}
                        
                    </h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 ">
                   {children}
                </div>
            </main>
        </div>
    );
};

export default PageComponent;
