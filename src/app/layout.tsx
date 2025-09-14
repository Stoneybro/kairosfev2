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
  description:
    "Kairos is an accountability platform powered by smart wallets. It helps individuals and teams enforce discipline through financial stakes and automated task rules.",
  keywords: [
    "accountability app",
    "smart wallet",
    "ERC4337",
    "account abstraction",
    "task management",
    "on-chain productivity",
    "discipline app",
    "Base blockchain",
  ],
  authors: [{ name: "Zion Livingstone (stoneybro)" }],
  creator: "Zion Livingstone",
  publisher: "Kairos",
  openGraph: {
    type: "website",
    url: "https://www.usekairos.xyz/",
    title: "Kairos",
    description:
      "Kairos is an accountability platform powered by smart wallets. It helps individuals and teams enforce discipline through financial stakes and automated task rules",
    siteName: "Kairos",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Kairos App Preview",
      },
    ],
  },
  twitter:{
    card:"summary_large_image",
    title:"Kairos",
    description:
      "Kairos is an accountability platform powered by smart wallets. It helps individuals and teams enforce discipline through financial stakes and automated task rules",
      creator:"@z__stone",
      images:["/og-image.png"],
  },
  icons:{
    icon:["/favicon.ico"],
    apple:["/apple-icon.png"]
  },
  themeColor:"#1f2937",
  metadataBase:new URL("https://www.usekairos.xyz/")
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
