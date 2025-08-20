import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Provider from "./provider";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose weights you need
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Kairos",
  description: "Accountability, onChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={` ${inter.variable} ${poppins.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
