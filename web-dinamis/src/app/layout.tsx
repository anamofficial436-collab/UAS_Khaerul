import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Khaerul Anam - 2388010021",
  description:
    "Platform pengaduan masyarakat digital yang transparan, cepat, dan terpercaya.",
  keywords: "pengaduan, masyarakat, lapor, pemerintah, digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
