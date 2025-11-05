import { toast } from "sonner"

export function useNotification() {
  const success = (message: string) => {
    toast.success(message)
  }

  const error = (message: string) => {
    toast.error(message)
  }

  const info = (message: string) => {
    toast.message(message)
  }

  const loading = (message: string) => {
    toast.loading(message)
  }

  return { success, error, info, loading }
}
