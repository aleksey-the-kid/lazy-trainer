import { cn } from '@/lib/utils'

export interface NativeSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface NativeSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: NativeSelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
}

export function NativeSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  disabled,
  id,
}: NativeSelectProps) {
  return (
    <select
      id={id}
      disabled={disabled}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        'h-10 w-full min-w-0 appearance-auto rounded-lg border border-border/80 bg-input px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
