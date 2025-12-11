"use client"

import { useRouter } from "next/navigation"
import Image from "next/image" // Import Image component
import { useState } from "react"
import { Menu, X, LogOut, Users, BriefcaseBusiness, ListTodo, FileText } from "lucide-react"
import { useAuth } from "@/context/auth-context" // Import useAuth hook

export default function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn, signOut, isLoading: authLoading } = useAuth(); // Use auth context

  const loggedInNav = [
    { name: "Post Jobs", href: "/postjobs", icon: BriefcaseBusiness },
    { name: "Your Posts", href: "/yourposts", icon: FileText },
    { name: "All Jobs", href: "/jobs/all", icon: ListTodo },
  ]

  const handleLogout = async () => {
    await signOut(); // Use signOut from auth context
    setIsOpen(false);
  }

  const loggedOutNav = [
    { name: "All Jobs", href: "/alljobs", icon: ListTodo },
  ]

  const currentNav = isLoggedIn ? loggedInNav : loggedOutNav

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/logo.png" alt="SundarJobs Logo" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-lg text-text hidden sm:inline">SundarJobs</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-6">
            {currentNav.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </button>
            ))}
          </div>

          {/* Right side for desktop (Login/Logout) */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/signin")}
                className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
              >
                <Users className="w-4 h-4" />
                Login/Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-text">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {currentNav.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-text-muted hover:text-text"
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2 inline-block" />}
                {item.name}
              </button>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-text-muted hover:text-text"
              >
                <LogOut className="w-4 h-4 mr-2 inline-block" />
                Logout
              </button>
            )}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  router.push("/signin")
                  setIsOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-text-muted hover:text-text"
              >
                <Users className="w-4 h-4 mr-2 inline-block" />
                Login/Register
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
