export default function ModernTemplate() {
  return (
    <div
      className="w-full aspect-square flex flex-col justify-between p-12"
      style={{
        backgroundImage: "url('/template1_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div>
        <img src="/placeholder-logo.png" alt="Logo" className="h-16 mb-4" />
        <h1 className="text-5xl font-bold text-white mb-2">Job Title</h1>
        <p className="text-2xl text-white/90">Company Name</p>
      </div>

      {/* Content */}
      <div className="bg-white/95 rounded-xl p-8 text-gray-900">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Location</p>
            <p className="text-lg font-bold">City, State</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Job Type</p>
            <p className="text-lg font-bold">Full-time</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Salary</p>
            <p className="text-lg font-bold">$XX,XXX - $XX,XXX</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Experience</p>
            <p className="text-lg font-bold">X+ Years</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Apply by</p>
          <p className="font-bold">DD/MM/YYYY</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-white">
        <p className="text-sm">
          email@example.com | 123-456-7890
        </p>
      </div>
    </div>
  )
}
