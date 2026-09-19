import "./globals.css";
import { Share_Tech } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import VantaWavesBackground from "../components/common/VantaWavesBackground";

const shareTech = Share_Tech({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-share-tech",
});

export const metadata = {
  title: "FinPilot - AI Personal Finance Coach",
  description: "Track transactions, detect subscription leaks, manage budgets, and optimize your financial health.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={shareTech.variable}>
      <body className={`min-h-screen flex flex-col bg-bg text-text-primary antialiased selection:bg-accent selection:text-[#0A0E1A] relative ${shareTech.variable}`}>
        <VantaWavesBackground />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}