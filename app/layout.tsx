import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context" // Import AuthProvider
import { AuthChecker } from "@/components/AuthChecker" // Import AuthChecker

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobPoster - Professional Job Posting Generator",
  description: "Create beautiful job posters in minutes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <AuthProvider>  
          <AuthChecker>{children}</AuthChecker>
        </AuthProvider>
        <Toaster theme="light" />
      </body>
    </html>
  )
}
