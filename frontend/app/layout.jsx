import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "FinPilot - AI Personal Finance Coach",
  description: "Track transactions, detect subscription leaks, manage budgets, and optimize your financial health.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/dashboard" className="font-bold text-xl text-slate-900 flex items-center gap-2">
                <span className="bg-lime-500 text-white rounded px-2 py-0.5 text-sm font-black">FP</span>
                FinPilot
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
                <Link href="/transactions" className="hover:text-slate-900 transition-colors">Transactions</Link>
                <Link href="/subscriptions" className="hover:text-slate-900 transition-colors">Subscriptions</Link>
                <Link href="/budget" className="hover:text-slate-900 transition-colors">Budget</Link>
                <Link href="/coach" className="hover:text-slate-900 transition-colors">Coach</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-7xl w-full mx-auto p-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
