import { useTranslation } from 'react-i18next'
import { Loader2, LogIn, FileText, CheckCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from './use-auth'

const featureKeys = [
  {
    icon: FileText,
    titleKey: 'features.transcription.title',
    descriptionKey: 'features.transcription.description',
  },
  {
    icon: CheckCircle,
    titleKey: 'features.review.title',
    descriptionKey: 'features.review.description',
  },
  {
    icon: Users,
    titleKey: 'features.collaboration.title',
    descriptionKey: 'features.collaboration.description',
  },
]

export function LoginForm() {
  const { t } = useTranslation('auth')
  const { login, isLoading } = useAuth()

  const handleLogin = () => {
    login()
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Branding Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('login.title')}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {t('login.subtitle')}
        </p>
      </div>

      {/* Login Card */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl">{t('login.welcome')}</CardTitle>
          <CardDescription>
            {t('login.signInPrompt')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleLogin}
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('login.connecting')}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t('login.signInWithAuth0')}
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t('login.features')}
              </span>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            {featureKeys.map((feature) => (
              <div
                key={feature.titleKey}
                className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3"
              >
                <feature.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t(feature.titleKey)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        {t('login.secureAuth')}
      </p>
    </div>
  )
}
