// app/login/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LoginLayout({ children }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 antialiased min-h-screen flex items-center justify-center`}
    >
      {children}
    </div>
  );
}