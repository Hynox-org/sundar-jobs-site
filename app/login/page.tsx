"use client"

import { useRouter } from "next/navigation"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
// import { Alert } from 'react-native' // Removed, using browser alert for web

export default function AuthenticateScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    })

    if (error) {
      alert(`Login Error: ${error.message}`) // Using browser alert for web
    } else {
      alert('Welcome to JobPoster! 🎉 Please Check out the Job Vacancies')
      router.replace('/')
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      alert('Error: Passwords do not match')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      alert(`Sign Up Error: ${error.message}`) // Using browser alert for web
    } else {
      alert('Welcome to JobPoster! 🎉 Please Check out the Job Vacancies')
      router.replace('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-10 pb-10 flex flex-col justify-center items-center">
      <div className="mx-4 bg-white rounded-3xl p-6 shadow-xl max-w-md w-full my-auto">
        {mode === 'login' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              {/* <Ionicons name="log-in-outline" size={28} color="#EF233C" /> */}
              <span className="text-red-500 text-3xl">➡️</span> {/* Placeholder for icon */}
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <Ionicons name="mail-outline" size={18} color="#8D80AD" /> */}
                <span className="text-gray-500">📧</span> {/* Placeholder for icon */}
                <label htmlFor="email" className="text-sm font-semibold text-gray-900">Email Address</label>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl border-2 border-transparent px-4 h-14">
                <input
                  type="email"
                  id="email"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <Ionicons name="lock-closed-outline" size={18} color="#8D80AD" /> */}
                <span className="text-gray-500">🔒</span> {/* Placeholder for icon */}
                <label htmlFor="password" className="text-sm font-semibold text-gray-900">Password</label>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl border-2 border-transparent px-4 h-14">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  {/* <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#8D80AD" /> */}
                  <span className="text-gray-500">{showPassword ? "👁️" : "🙈"}</span> {/* Placeholder for icon */}
                </button>
              </div>
            </div>

            <button
              onClick={signInWithEmail}
              disabled={loading}
              className={`h-14 rounded-2xl mt-2 overflow-hidden w-full flex items-center justify-center gap-2
                ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-red-500 to-yellow-500'} text-white text-lg font-bold`}
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <span className="text-white">→</span> {/* Placeholder for arrow icon */}
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              {/* <Ionicons name="create-outline" size={28} color="#EF233C" /> */}
              <span className="text-red-500 text-3xl">📝</span> {/* Placeholder for icon */}
              <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <Ionicons name="person-outline" size={18} color="#8D80AD" /> */}
                <span className="text-gray-500">👤</span> {/* Placeholder for icon */}
                <label htmlFor="fullName" className="text-sm font-semibold text-gray-900">Full Name</label>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl border-2 border-transparent px-4 h-14">
                <input
                  type="text"
                  id="fullName"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <Ionicons name="mail-outline" size={18} color="#8D80AD" /> */}
                <span className="text-gray-500">📧</span> {/* Placeholder for icon */}
                <label htmlFor="email" className="text-sm font-semibold text-gray-900">Email Address</label>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl border-2 border-transparent px-4 h-14">
                <input
                  type="email"
                  id="email"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <Ionicons name="lock-closed-outline" size={18} color="#8D80AD" /> */}
                <span className="text-gray-500">🔒</span> {/* Placeholder for icon */}
                <label htmlFor="password" className="text-sm font-semibold text-gray-900">Password</label>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl border-2 border-transparent px-4 h-14">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  {/* <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#8D80AD" /> */}
                  <span className="text-gray-500">{showPassword ? "👁️" : "🙈"}</span> {/* Placeholder for icon */}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <Ionicons name="shield-checkmark-outline" size={18} color="#8D80AD" /> */}
                <span className="text-gray-500">✅</span> {/* Placeholder for icon */}
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900">Confirm Password</label>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl border-2 border-transparent px-4 h-14">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="flex-1 text-base text-gray-900 bg-transparent outline-none"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1"
                >
                  {/* <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#8D80AD" /> */}
                  <span className="text-gray-500">{showConfirmPassword ? "👁️" : "🙈"}</span> {/* Placeholder for icon */}
                </button>
              </div>
            </div>

            <button
              onClick={signUpWithEmail}
              disabled={loading}
              className={`h-14 rounded-2xl mt-2 overflow-hidden w-full flex items-center justify-center gap-2
                ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-red-500 to-yellow-500'} text-white text-lg font-bold`}
            >
              <span>{loading ? 'Creating...' : 'Create Account'}</span>
              <span className="text-white">✔️</span> {/* Placeholder for checkmark icon */}
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          {mode === 'login' ? (
            <div className="flex justify-center items-center gap-2">
              <p className="text-base text-gray-600">Don't have an account?</p>
              <button
                type="button"
                onClick={() => setMode('signup')}
                disabled={loading}
                className="text-base text-red-500 font-bold"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <p className="text-base text-gray-600">Already have an account?</p>
              <button
                type="button"
                onClick={() => setMode('login')}
                disabled={loading}
                className="text-base text-red-500 font-bold"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {/* <Ionicons name="shield-checkmark" size={20} color="#8D80AD" /> */}
        <span className="text-gray-500">🛡️</span> {/* Placeholder for icon */}
        <p className="text-sm text-gray-500 font-semibold">Secure & Encrypted</p>
      </div>
    </div>
  )
}
