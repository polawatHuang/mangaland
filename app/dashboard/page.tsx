"use client";

import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  StarIcon,
  InboxIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon },
  { name: "Editor Homepage", icon: DocumentTextIcon },
  { name: "My Blog", icon: DocumentTextIcon },
  { name: "My Project", icon: DocumentTextIcon },
  { name: "My Profile", icon: UserIcon },
  { name: "Favourite", icon: StarIcon },
  { name: "Message & Ticket", icon: InboxIcon },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={clsx("fixed md:relative inset-y-0 left-0 w-64 bg-[#374151] p-4 flex flex-col transition-transform duration-300", sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Menu</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-md",
                activeTab === item.name ? "bg-[#4B5563]" : "hover:bg-[#4B5563]"
              )}
              onClick={() => {
                setActiveTab(item.name);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64">
        <header className="flex justify-between items-center">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold">{activeTab}</h2>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-[#4B5563] rounded-lg">
              <span>Username</span>
              <Cog6ToothIcon className="w-5 h-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#4B5563] rounded-md shadow-lg p-2">
                <Menu.Item>
                  {({ active }) => (
                    <button className={clsx("block w-full text-left px-4 py-2", active && "bg-[#6B7280]")}>Profile</button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={clsx("block w-full text-left px-4 py-2", active && "bg-[#6B7280]")}>Logout</button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>

        {/* Dashboard Content */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#374151] p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">ประกาศจากทีมงาน</h3>
            <p className="mt-2 text-gray-300">ประกาศเกี่ยวกับการอัปเดตและแก้ไขปัญหาของระบบ</p>
          </div>
          <div className="bg-[#374151] p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">คู่มือใช้งานระบบ</h3>
            <p className="mt-2 text-gray-300">แนะนำการใช้งานระบบสำหรับมือใหม่</p>
          </div>
        </section>
      </main>
    </div>
  );
}