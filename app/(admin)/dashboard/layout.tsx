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
  { name: "Project List", href: "/dashboard/project-list", icon: BookOpenIcon },
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
        <div className="h-screen flex overflow-hidden text-[#333] bg-gradient-to-b from-[#f5f5f5] to-[#ffffff]">
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
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-[#d4d4d4] to-[#ffffff]">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#555]"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon
                        className="h-6 w-6 text-[#333]"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-[#bfbfbf] text-[#333]"
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 text-[#333]"
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
            <div className="flex flex-col w-64 bg-gradient-to-b from-[#ffc2df] to-[#ffffff] border-r border-[#bfbfbf]">
              <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-[#ffc2df] text-[#333]">
                Menu
              </div>
              <nav className="flex-1 px-2 space-y-1">
                <br />
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base text-[#333] hover:bg-[#eb4897] hover:text-white font-medium rounded-md"
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
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-[#f5f5f5] border-b border-[#bfbfbf] shadow">
              <button
                className="px-4 border-r border-[#bfbfbf] text-[#333] focus:outline-none md:hidden"
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
