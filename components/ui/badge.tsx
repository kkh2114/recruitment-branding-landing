import * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        variant === "default"
          ? "border-transparent bg-blue-500 text-white hover:bg-blue-600"
          : variant === "secondary"
          ? "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200"
          : variant === "destructive"
          ? "border-transparent bg-red-500 text-white hover:bg-red-600"
          : "text-gray-600"
      } ${className || ''}`}
      {...props}
    />
  )
}

export { Badge } 