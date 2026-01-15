import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UBIT Chat",
  description: "Professional SaaS Chat Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#020617] text-slate-200 overflow-hidden`}>{children}</body>
    </html>
  );
}
