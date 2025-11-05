export default function ProfessionalTemplate() {
  return (
    <div className="w-full aspect-square flex flex-col p-10" style={{ backgroundImage: "url('/template1_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Top Bar */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <img src="/placeholder-logo.png" alt="Logo" className="h-12 mb-2" />
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Company Name</h2>
        </div>
        <div className="w-1 h-24" style={{ backgroundColor: "#606C38" }} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#606C38" }}>
        Job Title
      </h1>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Location</p>
          <p className="text-lg font-semibold text-gray-800">City, State</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Type</p>
          <p className="text-lg font-semibold text-gray-800">Full-time</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Salary</p>
          <p className="text-lg font-semibold text-gray-800">$XX,XXX - $XX,XXX</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Experience</p>
          <p className="text-lg font-semibold text-gray-800">X+ Years</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex-grow mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">About This Role</p>
        <p className="text-sm text-gray-700 line-clamp-4">This is a placeholder for the job description. It will contain details about the role, responsibilities, and what the company is looking for in a candidate.</p>
      </div>

      {/* Footer */}
      <div className="border-t pt-4" style={{ borderColor: "#DDA15E" }}>
        <p className="text-xs font-semibold uppercase mb-2" style={{ color: "#DDA15E" }}>
          Apply Now
        </p>
        <p className="text-xs text-gray-600">
          email@example.com | 123-456-7890
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Deadline: DD/MM/YYYY
        </p>
      </div>
    </div>
  )
}
