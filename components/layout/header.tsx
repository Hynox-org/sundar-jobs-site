"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X, Bookmark, SettingsIcon } from "lucide-react"

export default function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#606C38" }}>
              <span className="text-white font-bold">JP</span>
            </div>
            <span className="font-bold text-lg text-text hidden sm:inline">JobPoster</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => router.push("/")} className="text-text-muted hover:text-text transition-colors">
              Home
            </button>
            <button
              onClick={() => router.push("/drafts")}
              className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              Drafts
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                router.push("/")
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-text-muted hover:text-text"
            >
              Home
            </button>
            <button
              onClick={() => {
                router.push("/drafts")
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-text-muted hover:text-text"
            >
              Drafts
            </button>
            <button
              onClick={() => {
                router.push("/settings")
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-text-muted hover:text-text"
            >
              Settings
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
