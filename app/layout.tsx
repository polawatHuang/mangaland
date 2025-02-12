import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar/Navbars";

const kanit = Kanit({
    weight: ["100", "200", "400", "600"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${kanit.className} antialiased bg-black`}>
                <Navbar />
                <div className="min-h-screen">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
