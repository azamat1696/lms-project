import {
  ClerkProvider
} from '@clerk/nextjs'
import './globals.css'
import { Inter } from "next/font/google";
import {Metadata} from "next";
import ToasterProvider from "@/components/providers/toaster-provider";
import ConfettiProvider from "@/components/providers/confetti-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LMS Platform | by Ibnu",
    description: "LMS Platform by Next.js ",
    icons: {
        icon: "./../icon.svg",
    },
};
export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <ClerkProvider>
        <html lang="en">
            <body className={inter.className}>
              <ConfettiProvider />
               {children}
               <ToasterProvider />
            </body>
        </html>
      </ClerkProvider>
  )
}
