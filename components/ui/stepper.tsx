interface StepperProps {
  currentStep: number
  steps: string[]
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          {/* Step Circle */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${
              index < currentStep ? "text-white" : "text-text-muted"
            }`}
            style={{
              backgroundColor: index < currentStep ? "#606C38" : "#E8E5D0",
            }}
          >
            {index + 1}
          </div>

          {/* Step Label */}
          <span className={`ml-2 font-semibold ${index < currentStep ? "text-text" : "text-text-muted"}`}>{step}</span>

          {/* Divider */}
          <div
            className={`flex-1 h-1 mx-2 ${index < currentStep - 1 ? "bg-border" : "bg-border"}`}
            style={{
              backgroundColor: index < currentStep - 1 ? "#606C38" : "#E8E5D0",
            }}
          />
        </div>
      ))}
    </div>
  )
}
