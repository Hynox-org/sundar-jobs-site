"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import { Download, Upload, Trash2, ChevronLeft } from "lucide-react"
import { StorageUtils } from "@/utils/storage"
import { useNotification } from "@/hooks/useNotification"

export default function SettingsPage() {
  const router = useRouter()
  const { success, error } = useNotification()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = StorageUtils.exportData()
      const link = document.createElement("a")
      link.href = `data:application/json;charset=utf-8,${encodeURIComponent(data)}`
      link.download = `job-posters-backup-${Date.now()}.json`
      link.click()
      success("Data exported successfully!")
    } catch (err) {
      console.error("Export error:", err)
      error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const importSuccess = StorageUtils.importData(text)
      if (importSuccess) {
        success("Data imported successfully!")
        setTimeout(() => router.refresh(), 1000)
      } else {
        error("Invalid file format")
      }
    } catch (err) {
      console.error("Import error:", err)
      error("Failed to import data")
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure? This will delete ALL drafts and data. This cannot be undone.")) {
      try {
        StorageUtils.clearAllData()
        success("All data cleared")
        setTimeout(() => router.push("/"), 1500)
      } catch (err) {
        console.error("Clear error:", err)
        error("Failed to clear data")
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#606C38] hover:text-[#3E4620] font-semibold mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Export Section */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Data Management</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Export Backup</h3>
              <p className="text-text-muted text-sm mb-4">Download a backup of all your drafts and settings</p>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 btn-primary disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Export Data"}
              </button>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2">Import Backup</h3>
              <p className="text-text-muted text-sm mb-4">Restore drafts from a previous backup</p>
              <label className="flex items-center gap-2 btn-secondary cursor-pointer inline-block disabled:opacity-50">
                <Upload className="w-4 h-4" />
                {isImporting ? "Importing..." : "Import Data"}
                <input type="file" accept=".json" onChange={handleImport} disabled={isImporting} className="hidden" />
              </label>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2 text-[#BC6C25]">Clear All Data</h3>
              <p className="text-text-muted text-sm mb-4">
                Permanently delete all drafts and settings. This cannot be undone.
              </p>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-semibold"
                style={{
                  backgroundColor: "#BC6C25",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8D4D18")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#BC6C25")}
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <p className="text-text-muted mb-2">
            <strong>JobPoster</strong> v1.0
          </p>
          <p className="text-text-muted">
            A professional job poster generator built to create beautiful, eye-catching job postings in minutes.
          </p>
        </div>
      </div>
    </main>
  )
}
