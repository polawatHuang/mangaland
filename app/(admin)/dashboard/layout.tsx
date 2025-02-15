"use client";

import { useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  CogIcon,
  Bars2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import "../../globals.css";
import Navbars from "@/app/components/Navbar/Navbars";
import Footer from "@/app/components/Footer/Footer";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon },
  { name: "Manga List", href: "#", icon: BookOpenIcon },
  { name: "Users", href: "#", icon: UsersIcon },
  { name: "Settings", href: "#", icon: CogIcon },
];

// const menuItems = [
//   { name: "Dashboard", icon: HomeIcon },
//   { name: "Editor Homepage", icon: DocumentTextIcon },
//   { name: "My Blog", icon: DocumentTextIcon },
//   { name: "My Project", icon: DocumentTextIcon },
//   { name: "My Profile", icon: UserIcon },
//   { name: "Favourite", icon: StarIcon },
//   { name: "Message & Ticket", icon: InboxIcon },
// ];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html>
      <body>
        <Navbars />
        <div className="h-screen flex overflow-hidden bg-gray-900 text-gray-100">
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
                <div className="fixed inset-0 bg-black bg-opacity-75" />
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
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700"
                      >
                        <item.icon
                          className="mr-4 h-6 w-6"
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
            <div className="flex flex-col w-64 bg-gray-800">
              <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
                Manga Admin
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-700"
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
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-gray-900 shadow">
              <button
                className="px-4 border-r border-gray-700 text-gray-300 focus:outline-none md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 px-4 flex justify-between">
                <h1 className="text-lg font-semibold self-center">Dashboard</h1>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-sm focus:outline-none">
                    <span>Admin</span>
                  </Menu.Button>
                </Menu>
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
