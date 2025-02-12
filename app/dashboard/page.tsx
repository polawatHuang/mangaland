"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  StarIcon,
  InboxIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon },
  { name: "Editor Homepage", icon: DocumentTextIcon },
  { name: "My Blog", icon: DocumentTextIcon },
  { name: "My Project", icon: DocumentTextIcon },
  { name: "My Profile", icon: UserIcon },
  { name: "Favourite", icon: StarIcon },
  { name: "Message & Ticket", icon: InboxIcon },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold">{activeTab}</h1>

      {/* Dashboard Content */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Dashboard Widgets */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Total Projects</h2>
          <p className="text-2xl mt-2 font-semibold">125</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Active Users</h2>
          <p className="text-2xl mt-2 font-semibold">48</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">New Messages</h2>
          <p className="text-2xl mt-2 font-semibold">8</p>
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "flex items-center gap-3 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors",
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
};