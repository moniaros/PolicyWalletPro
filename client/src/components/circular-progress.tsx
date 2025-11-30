interface CircularProgressProps {
  value: number;
  max?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  strokeWidth = 6,
  className = "text-blue-600",
}: CircularProgressProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
      {/* Background Circle */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-secondary/30"
      />
      {/* Progress Circle */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className={`transition-all duration-500 ${className}`}
      />
    </svg>
  );
}
