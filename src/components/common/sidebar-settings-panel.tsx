import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LogOut, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'

interface SidebarSettingsPanelProps {
  /** Whether the sidebar is collapsed (icon-only mode) */
  isCollapsed?: boolean
  /** Additional class name for the container */
  className?: string
  /** Whether to show the settings toggle button (useful when always expanded) */
  showToggleButton?: boolean
  /** Default expanded state */
  defaultExpanded?: boolean
}

export function SidebarSettingsPanel({
  isCollapsed = false,
  className,
  showToggleButton = true,
  defaultExpanded = false,
}: SidebarSettingsPanelProps) {
  const { t } = useTranslation('common')
  const { logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(defaultExpanded)

  const toggleSettings = () => {
    setSettingsOpen((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
  }

  // When collapsed, only show the toggle button
  if (isCollapsed) {
    return (
      <div className={cn('p-2', className)}>
        {showToggleButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
            onClick={toggleSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  const isExpanded = settingsOpen || !showToggleButton

  return (
    <div className={className}>
      {/* Settings Panel - Animated */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          isExpanded ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col gap-2 rounded-lg bg-sidebar-accent/50 p-2">
          {/* Language Toggle */}
          <LanguageToggle />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">{t('actions.logout')}</span>
          </Button>
        </div>
      </div>

      {/* Toggle Button */}
      {showToggleButton && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 shrink-0 text-muted-foreground hover:text-sidebar-foreground transition-transform duration-200',
            settingsOpen && 'rotate-90'
          )}
          onClick={toggleSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

