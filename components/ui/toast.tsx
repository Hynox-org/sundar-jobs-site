import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface ToastProps {
  type: "success" | "error" | "info"
  message: string
  onClose?: () => void
}

export default function Toast({ type, message, onClose }: ToastProps) {
  const bgColor = {
    success: "bg-[#606C38]",
    error: "bg-[#BC6C25]",
    info: "bg-[#DDA15E]",
  }[type]

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type]

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg z-50 ${bgColor} text-white`}
    >
      <Icon className="w-5 h-5" />
      {message}
    </div>
  )
}
