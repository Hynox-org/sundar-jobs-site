import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Spinner className="h-8 w-8" />
      <p className="text-text-secondary ml-4">Loading templates...</p>
    </main>
  );
}
