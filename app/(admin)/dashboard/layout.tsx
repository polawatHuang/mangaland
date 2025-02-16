"use client";

import { useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  ArrowUturnLeftIcon,
  Bars2Icon,
  XMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import "../../globals.css";
import Navbars from "@/app/components/Navbar/Navbars";
import Footer from "@/app/components/Footer/Footer";
import clsx from "clsx";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Account", href: "#", icon: UsersIcon },
  { name: "Project List", href: "/dashboard/project-list", icon: BookOpenIcon },
  { name: "Favorite Project", href: "#", icon: HeartIcon },
  { name: "User Management", href: "#", icon: UsersIcon },
  { name: "Logout", href: "#", icon: ArrowUturnLeftIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html>
      <body className="bg-black text-white">
        <Navbars />
        <div className="h-screen flex overflow-hidden text-white">
          {/* Mobile sidebar */}
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 flex z-40 md:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-[#000000] bg-opacity-25" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#555]"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-[#bfbfbf] text-white"
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
            </Dialog>
          </Transition.Root>

          {/* Sidebar for larger screens */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 bg-gradient-to-b from-[#060606] border-r border-[#282524]">
              <div className={clsx(`bg-[#060606]`,"h-16 flex items-center justify-center text-xl font-bold border-b border-[#282524] text-white")}>
                Menu
              </div>
              <nav className="flex-1 px-2 space-y-1">
                <br />
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base text-[#898fa8] hover:bg-[#eb4897] hover:text-white font-medium rounded-md"
                  >
                    <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-[#060606] border-b border-[#282524] shadow">
              <button
                className="px-4 border-r border-[#282524] text-white focus:outline-none md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 px-4 flex justify-between">
                <h1 className="text-lg font-semibold self-center">Dashboard</h1>
              </div>
            </div>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
