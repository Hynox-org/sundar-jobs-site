export default function MinimalistTemplate() {
  return (
    <div className="w-full aspect-square flex flex-col justify-between p-16" style={{ backgroundImage: "url('/template1_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Header */}
      <div>
        <h1 className="text-6xl font-black mb-8" style={{ color: "#606C38" }}>
          Job Title
        </h1>
        <p className="text-gray-600 text-lg mb-1">Company Name</p>
        <p className="text-gray-400 text-sm">Location</p>
      </div>

      {/* Middle */}
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: "#606C38" }}>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Job Type</p>
            <p className="font-semibold text-gray-900">Full-time</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Salary</p>
            <p className="font-semibold text-gray-900">$XX,XXX - $XX,XXX</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Experience</p>
          <p className="font-semibold text-gray-900">X+ Years</p>
        </div>
      </div>

      {/* Footer */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#DDA15E" }}>
          Apply By DD/MM/YYYY
        </p>
        <p className="text-sm text-gray-700">email@example.com</p>
      </div>
    </div>
  )
}
