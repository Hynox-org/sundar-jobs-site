export default function CreativeTemplate() {
  return (
    <div className="w-full aspect-square relative overflow-hidden" style={{ backgroundImage: "url('/template1_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-10">
        {/* Header */}
        <div>
          <img src="/placeholder-logo.png" alt="Logo" className="h-14 mb-4" />
          <div>
            <p className="text-sm font-bold text-gray-500 mb-2 uppercase">Now Hiring</p>
            <h1 className="text-5xl font-black mb-2" style={{ color: "#DDA15E" }}>
              Job Title
            </h1>
            <p className="text-2xl font-bold" style={{ color: "#BC6C25" }}>
              @ Company Name
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8" style={{ backgroundColor: "#DDA15E" }} />
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase">Location</p>
              <p className="font-bold text-gray-900">City, State</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-8" style={{ backgroundColor: "#BC6C25" }} />
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase">Salary</p>
              <p className="font-bold text-gray-900">$XX,XXX - $XX,XXX</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div>
          <p className="text-xs text-gray-600 mb-2">Apply: email@example.com</p>
          <p className="text-xs text-gray-600">
            Deadline: DD/MM/YYYY
          </p>
        </div>
      </div>
    </div>
  )
}
