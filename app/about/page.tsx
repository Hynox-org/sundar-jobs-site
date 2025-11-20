"use client"

import React from 'react'
import Header from "@/components/layout/header"

export default function AboutScreen() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="max-w-2xl w-full text-center p-6 rounded-lg">
          <h1 className="text-4xl font-bold text-text mb-5">About SundarJobs</h1>
          <p className="text-lg text-text mb-5 leading-relaxed">
            SundarJobs is an innovative platform dedicated to connecting job seekers with their dream opportunities.
            We strive to provide a seamless and efficient job search experience, helping individuals find roles that match their skills and aspirations.
          </p>
          <p className="text-md text-text-muted">Version 1.0.0</p>
        </div>
      </div>
    </main>
  )
}
