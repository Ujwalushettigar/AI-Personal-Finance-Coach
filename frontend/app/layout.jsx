import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

export const metadata = {
  title: "FinPilot | AI Personal Finance Coach",
  description:
    "Track, Understand, and Act on your financial transactions with AI intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: "#07080d" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#07080d",
          color: "#f8fafc",
          fontFamily:
            "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          WebkitFontSmoothing: "antialiased",
          minHeight: "100vh",
        }}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}