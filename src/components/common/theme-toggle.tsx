import { Monitor, Sun, Moon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useUIStore, type Theme } from '@/store/use-ui-store'

const themeOptions: { value: Theme; icon: React.ElementType }[] = [
  { value: 'system', icon: Monitor },
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
]

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useUIStore()

  return (
    <div className={cn('flex items-center justify-start', className)}>
      <div className="flex items-center gap-1 rounded-full bg-sidebar-accent p-1">
        {themeOptions.map((themeOpt) => {
          const Icon = themeOpt.icon
          const isSelected = theme === themeOpt.value
          return (
            <button
              key={themeOpt.value}
              onClick={() => setTheme(themeOpt.value)}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                isSelected
                  ? 'bg-sidebar text-sidebar-foreground'
                  : 'text-muted-foreground hover:text-sidebar-foreground'
              )}
              aria-label={`Set theme to ${themeOpt.value}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

