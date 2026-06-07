interface UpdateToastProps {
  message: string
  onClick: () => void
}

export function UpdateToast({ message, onClick }: UpdateToastProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-xl border border-primary/40 bg-card p-4 text-left shadow-[0_8px_32px_-8px_var(--primary)] transition-transform active:scale-[0.98]"
    >
      <p className="text-sm font-medium text-foreground">{message}</p>
    </button>
  )
}
