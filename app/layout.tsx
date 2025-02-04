import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Extracted Contact Details",
  description: "Extracted Contact Details from multiple sources",
  // You can add more metadata fields if necessary for SEO
  keywords: ["contacts", "extraction", "details", "data"],
  openGraph: {
    title: "Extracted Contact Details",
    description: "Extracted Contact Details from multiple sources",
    url: "https://your-site.com", // Add your actual URL here
    siteName: "Extracted Contact Details",
  },
  twitter: {
    card: "summary_large_image",
    site: "@your-twitter-handle", // Replace with actual Twitter handle
    creator: "@your-twitter-handle", // Replace with actual creator handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
