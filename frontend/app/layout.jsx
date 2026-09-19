import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

export const metadata = {
  title: "FinPilot - AI Personal Finance Coach",
  description: "Track transactions, detect subscription leaks, manage budgets, and optimize your financial health.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#070b16] text-slate-100 antialiased selection:bg-accent selection:text-slate-950">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}