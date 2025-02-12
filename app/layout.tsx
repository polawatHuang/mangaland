import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "./components/Navbar/Navbars";

const kanit = Kanit({
    weight: ["100", "200", "400", "600"],
    subsets: ["latin"],
});

export const metadata = {
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
        className={`${kanit.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
