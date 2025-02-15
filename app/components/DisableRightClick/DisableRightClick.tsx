"use client";
import { useEffect } from "react";

const DisableRightClick = () => {
    useEffect(() => {
        const ctrlShiftKey = (e: KeyboardEvent, keyCode: string) => {
            return (
                e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0)
            );
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
            if (
                e.keyCode === 123 ||
                ctrlShiftKey(e, "I") ||
                ctrlShiftKey(e, "J") ||
                ctrlShiftKey(e, "C") ||
                (e.ctrlKey && e.keyCode === "U".charCodeAt(0))
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
};

export default DisableRightClick;
