import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "../globals.css";
import Navbars from "../components/Navbar/Navbars";
import Footer from "../components/Footer/Footer";

const kanit = Kanit({
    weight: ["100", "200", "400", "600"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MANGALAND - อ่านมังงะแปลไทย อัปเดตไวที่สุด!",
    description:
        "MANGALAND คือเว็บไซต์อ่านการ์ตูนออนไลน์ที่ออกแบบมาให้ใช้งานง่าย สะดวก รวดเร็ว พร้อมอัปเดตมังงะใหม่ทุกวัน! พบกับมังงะหลากหลายแนว ทั้งแอ็กชัน โรแมนซ์ แฟนตาซี และอีกมากมาย ทุกเรื่องแปลไทยให้อ่านฟรี คุณภาพคมชัด โหลดไว ไม่พลาดทุกตอนสำคัญ!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${kanit.className} relative w-screen max-w-screen overflow-x-hidden  antialiased bg-black`}
            >
                <Navbars />
                <div className="min-h-screen relative px-10 lg:px-20 2xl:px-0 mx-auto 2xl:max-w-6xl py-10">
                    {children}
                </div>
                <Footer />
                <div className="scroll-contai overflow-hidden">
                    <div className="scroll-bar"></div>
                </div>
            </body>
        </html>
    );
}
