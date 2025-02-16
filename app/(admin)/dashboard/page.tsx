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
            <h1 className="text-3xl font-semibold">{activeTab}</h1>

            {loading ? (
                <Loading />
            ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-[#060606] border border-solid border-[#161616] rounded-lg shadow-md text-white">
                        <h2 className="text-lg font-bold text-[#8f8d8d]">Server Status:</h2>
                        <p className="text-2xl mt-2 font-semibold">
                            {serverStatus?.result.systemStats.server}
                        </p>
                    </div>

                    <div className="p-4 bg-[#060606] border border-solid border-[#161616] rounded-lg shadow-md text-white">
                        <h2 className="text-lg font-bold text-[#8f8d8d]">CPU Usage:</h2>
                        <p className="text-2xl mt-2 font-semibold">
                            {serverStatus?.result.systemStats.cpu.usage}%
                        </p>
                    </div>

                    <div className="p-4 bg-[#060606] border border-solid border-[#161616] rounded-lg shadow-md text-white">
                        <h2 className="text-lg font-bold text-[#8f8d8d]">Memory Usage:</h2>
                        <p className="text-2xl mt-2 font-semibold">
                            {
                                serverStatus?.result.systemStats.memory
                                    .usagePercent
                            }
                            %
                        </p>
                    </div>

                    <div className="p-4 bg-[#060606] border border-solid border-[#161616] rounded-lg shadow-md text-white">
                        <h2 className="text-lg font-bold text-[#8f8d8d]">Disk Usage:</h2>
                        <p className="text-2xl mt-2 font-semibold">
                            {serverStatus?.result.systemStats.disk.usagePercent}
                            %
                        </p>
                    </div>

                    <div className="p-4 bg-[#060606] border border-solid border-[#161616] rounded-lg shadow-md text-white">
                        <h2 className="text-lg font-bold text-[#8f8d8d]">Uptime:</h2>
                        <p className="text-2xl mt-2 font-semibold">
                            {serverStatus?.result.systemStats.uptime.days}d{" "}
                            {serverStatus?.result.systemStats.uptime.hours}h{" "}
                            {serverStatus?.result.systemStats.uptime.minutes}m
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={clsx(
                                "flex items-center gap-3 p-4 rounded-lg border border-solid border-[#bfbfbf] text-[#808080] hover:bg-[#bfbfbf] transition-colors",
                                activeTab === item.name && "bg-gray-600"
                            )}
                            onClick={() => setActiveTab(item.name)}
                        >
                            <item.icon className="w-6 h-6" />
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
