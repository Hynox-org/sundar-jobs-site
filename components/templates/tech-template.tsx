interface TechTemplateProps {
  formData: any
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export default function TechTemplate({
  formData,
  primaryColor = "#606C38",
  secondaryColor = "#DDA15E",
  fontFamily = "monospace",
}: TechTemplateProps) {
  return (
    <div
      className="w-full aspect-square bg-gray-900 text-green-400 flex flex-col justify-between p-8"
      style={{ fontFamily }}
    >
      {/* Header Terminal */}
      <div className="border border-green-400 p-4 mb-4">
        <p className="text-xs opacity-70">{"> "} job --search</p>
        <p className="text-lg font-bold mt-2">{formData.jobTitle}</p>
        <p className="text-sm opacity-70 mt-1">@ {formData.companyName}</p>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between border-b border-green-400 pb-2">
          <span>{"< location >"}</span>
          <span>{formData.location}</span>
        </div>
        <div className="flex justify-between border-b border-green-400 pb-2">
          <span>{"< salary >"}</span>
          <span>{formData.salaryRange}</span>
        </div>
        <div className="flex justify-between border-b border-green-400 pb-2">
          <span>{"< type >"}</span>
          <span>{formData.jobType}</span>
        </div>
        <div className="flex justify-between border-b border-green-400 pb-2">
          <span>{"< experience >"}</span>
          <span>{formData.experienceRequired}</span>
        </div>
        <div className="flex justify-between">
          <span>{"< deadline >"}</span>
          <span>{new Date(formData.applicationDeadline).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-400 pt-4 mt-4">
        <p className="text-xs opacity-70">{`> apply_at:`}</p>
        <p className="text-sm">{formData.contactEmail}</p>
        <p className="text-sm">{formData.contactPhone}</p>
      </div>
    </div>
  )
}
