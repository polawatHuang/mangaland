"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import {
    HomeIcon,
    DocumentTextIcon,
    UserIcon,
    StarIcon,
    InboxIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import Loading from "@/app/components/Loading/Loading";

const menuItems = [
    { name: "Dashboard", icon: HomeIcon },
    { name: "Editor Homepage", icon: DocumentTextIcon },
    { name: "My Blog", icon: DocumentTextIcon },
    { name: "My Project", icon: DocumentTextIcon },
    { name: "My Profile", icon: UserIcon },
    { name: "Favourite", icon: StarIcon },
    { name: "Message & Ticket", icon: InboxIcon },
];

type ServerStatus = {
    success: boolean;
    message: string;
    result: {
        systemStats: {
            server: string;
            cpu: {
                usage: number;
            };
            memory: {
                usagePercent: number;
            };
            disk: {
                usagePercent: number;
            };
            uptime: {
                days: number;
                hours: number;
                minutes: number;
            };
        };
    };
};

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkIsLogin();
        const fetchStatus = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/status`
                );
                if (response.ok) {
                    const data: ServerStatus = await response.json();
                    setServerStatus(data);
                }
            } catch (error) {
                console.error("Failed to fetch server status:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const checkIsLogin = () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        const handleRightClick = (e: any) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", handleRightClick);

        return () => {
            document.removeEventListener("contextmenu", handleRightClick);
        };
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-semibold">Account</h1>

            {loading ? (
                <Loading />
            ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    test เนื้อหาใส่ที่นี่
                </div>
            )}
        </div>
    );
}
