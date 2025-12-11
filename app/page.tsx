"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import { BUSINESS_SECTORS } from "@/constants/business-sectors"
import { BusinessSectorCard } from "@/components/business-sector-card"
import { MessageCircle, Facebook, Instagram } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Simplified */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Browse Job Categories
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Explore opportunities across various industries
          </p>
        </div>

        {/* Job Categories Grid */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center -m-2">
            {BUSINESS_SECTORS.map((sector) => (
              <BusinessSectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        </div>

        {/* Social Media & App Promotion Section */}
        <div className="bg-gradient-to-r from-[#FEFAE0] to-[#FAEDCD] rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-3">
              Stay Connected
            </h2>
            <p className="text-text-muted">
              Join our community and get instant job updates
            </p>
          </div>

          {/* Social Media Groups */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <a
              href="https://chat.whatsapp.com/your-group-link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-8 h-8 text-[#25D366]" />
              <div className="text-left">
                <p className="font-semibold text-text">WhatsApp Group</p>
                <p className="text-sm text-text-muted">Join our community</p>
              </div>
            </a>

            <a
              href="https://facebook.com/groups/your-group"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <Facebook className="w-8 h-8 text-[#1877F2]" />
              <div className="text-left">
                <p className="font-semibold text-text">Facebook Group</p>
                <p className="text-sm text-text-muted">Follow for updates</p>
              </div>
            </a>

            <a
              href="https://instagram.com/your-account"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <Instagram className="w-8 h-8 text-[#E4405F]" />
              <div className="text-left">
                <p className="font-semibold text-text">Instagram</p>
                <p className="text-sm text-text-muted">Daily job posts</p>
              </div>
            </a>
          </div>

          {/* App Store Links */}
          <div className="text-center">
            <p className="text-text-muted mb-4 font-medium">
              Download our mobile app
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=your.app.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-14"
                />
              </a>
              <a
                href="https://apps.apple.com/app/your-app-id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="h-14"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
