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
        'h-11 w-full min-w-0 appearance-auto rounded-xl border border-border/60 bg-input px-4 py-2 text-base shadow-[inset_0_1px_2px_oklch(0.28_0.02_260_/_0.04)] transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
