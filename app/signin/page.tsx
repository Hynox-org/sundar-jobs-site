"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Briefcase } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function SignInPage() {
    const router = useRouter()
    const { isLoggedIn } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            router.push("/")
        }
    }, [isLoggedIn, router])

    if (isLoggedIn) return null

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (error) throw error

            if (data.user) {
                router.push("/")
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EDF2F4] px-4 py-12 relative overflow-hidden">
            {/* Animated background elements with SundarJobs colors */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#EF233C]/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-[#8D80AD]/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FBB13C]/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Glassmorphism Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-[#e0e0e0]">
                    {/* Header with SundarJobs branding */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#EF233C] to-[#8D80AD] rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#000000] mb-2">Welcome Back</h1>
                        <p className="text-[#6c757d]">Sign in to SundarJobs and find your dream job</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-[#EF233C]/10 border border-[#EF233C]/30 rounded-xl text-[#EF233C] text-sm flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#EF233C] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">!</div>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSignIn} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#000000] mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#EF233C]">
                                    <Mail className="h-5 w-5 text-[#6c757d] group-focus-within:text-[#EF233C]" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-[#e0e0e0] rounded-xl focus:ring-2 focus:ring-[#EF233C]/20 focus:border-[#EF233C] transition-all duration-200 bg-white text-[#000000] placeholder:text-[#6c757d]"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-[#000000] mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-[#EF233C]">
                                    <Lock className="h-5 w-5 text-[#6c757d] group-focus-within:text-[#EF233C]" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-12 pr-12 py-3.5 border-2 border-[#e0e0e0] rounded-xl focus:ring-2 focus:ring-[#EF233C]/20 focus:border-[#EF233C] transition-all duration-200 bg-white text-[#000000] placeholder:text-[#6c757d]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-[#EDF2F4] rounded-r-xl transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-[#6c757d] hover:text-[#000000]" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-[#6c757d] hover:text-[#000000]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-[#8D80AD] hover:text-[#EF233C] transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#EF233C] to-[#EF233C]/90 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-[#EF233C]/90 hover:to-[#EF233C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF233C] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Alternative Sign In */}
                        {/* <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#e0e0e0]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-[#6c757d] font-medium">or continue with</span>
                            </div>
                        </div> */}

                        {/* Social Login Buttons */}
                        {/* <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#e0e0e0] rounded-xl hover:border-[#8D80AD] hover:bg-[#8D80AD]/5 transition-all duration-200 font-medium text-[#000000]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="text-sm">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#e0e0e0] rounded-xl hover:border-[#FBB13C] hover:bg-[#FBB13C]/5 transition-all duration-200 font-medium text-[#000000]"
                            >
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <span className="text-sm">Facebook</span>
                            </button>
                        </div> */}
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-[#6c757d]">
                            New to SundarJobs?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-[#EF233C] hover:text-[#8D80AD] transition-colors duration-200 inline-flex items-center gap-1"
                            >
                                Create an account
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-[#6c757d] mt-6 px-4">
                    By signing in, you agree to our{" "}
                    <a href="/terms" className="text-[#8D80AD] hover:text-[#EF233C] font-semibold transition-colors duration-200">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#8D80AD] hover:text-[#EF233C] font-semibold transition-colors duration-200">
                        Privacy Policy
                    </a>
                </p>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
