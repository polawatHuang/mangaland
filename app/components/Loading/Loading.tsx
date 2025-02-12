"use client";

import React from "react";
import { Mosaic } from "react-loading-indicators";

function Loading() {
    return (
        <div className=" fixed top-0 left-0 z-50 bg-black w-screen h-screen">
            <div className="justify-center items-center flex flex-col w-full h-full gap-3">
                <Mosaic color="#eb4897" size="large" text="" textColor="" />
                <span className="text-xl">Loading...</span>
            </div>
        </div>
    );
}

export default Loading;
