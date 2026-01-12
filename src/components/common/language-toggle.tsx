import { cn } from '@/lib/utils'
import { useUIStore, type Language } from '@/store/use-ui-store'

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'bo', label: 'BO' },
]

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useUIStore()

  return (
    <div className={cn('flex items-center justify-start', className)}>
      <div className="flex items-center gap-1 rounded-full bg-sidebar-accent p-1">
        {languageOptions.map((lang) => {
          const isSelected = language === lang.value
          return (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                isSelected
                  ? 'bg-sidebar text-sidebar-foreground'
                  : 'text-muted-foreground hover:text-sidebar-foreground'
              )}
              aria-label={`Set language to ${lang.label}`}
            >
              {lang.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

