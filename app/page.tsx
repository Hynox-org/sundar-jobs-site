"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import { FileText, Bookmark, Settings } from "lucide-react"
import { BUSINESS_SECTORS } from "@/constants/business-sectors" // Import business sectors
import { BusinessSectorCard } from "@/components/business-sector-card" // Import BusinessSectorCard

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">Create Professional Job Posters</h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
            Design beautiful, eye-catching job postings in minutes. Choose from 6 professional templates and customize
            them to match your brand.
          </p>
          <button onClick={() => router.push("/form")} className="btn-primary text-lg px-8 py-3">
            Create New Poster
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="card">
            <FileText className="w-12 h-12 text-[#606C38] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Forms</h3>
            <p className="text-text-muted">Fill in job details with our intuitive form. Auto-saves as you type.</p>
          </div>
          <div className="card">
            <Bookmark className="w-12 h-12 text-[#DDA15E] mb-4" />
            <h3 className="text-xl font-semibold mb-2">6 Templates</h3>
            <p className="text-text-muted">
              Choose from modern, professional, creative, minimal, bold, or tech designs.
            </p>
          </div>
          <div className="card">
            <Settings className="w-12 h-12 text-[#BC6C25] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customize</h3>
            <p className="text-text-muted">Adjust colors, fonts, and layouts to match your brand identity.</p>
          </div>
        </div>

        {/* Job Categories Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-text mb-6 text-center">Browse Job Categories</h2>
          <div className="flex flex-wrap justify-center -m-2"> {/* Use -m-2 to offset inner p-2 */}
            {BUSINESS_SECTORS.map((sector) => (
              <BusinessSectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
