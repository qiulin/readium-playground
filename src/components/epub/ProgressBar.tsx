interface ProgressBarProps {
  percentage: number
  onChange?: (percentage: number) => void
}

export function ProgressBar({ percentage, onChange }: ProgressBarProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = (x / rect.width) * 100
    onChange(Math.max(0, Math.min(100, percent)))
  }

  return (
    <div
      className="h-2 bg-gray-200 rounded-full cursor-pointer"
      onClick={handleClick}
      title={`${Math.round(percentage)}%`}
    >
      <div
        className="h-full bg-blue-500 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
