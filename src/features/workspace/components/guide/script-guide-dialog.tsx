import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/store/use-ui-store'

const GUIDE_PDFS = {
  en: '/guides/Scripts Identification Guide en.pdf',
  bo: '/guides/Scripts Identification Guide bo.pdf',
} as const

interface ScriptGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScriptGuideDialog({
  open,
  onOpenChange,
}: ScriptGuideDialogProps) {
  const { t } = useTranslation('workspace')
  const { language } = useUIStore()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-5xl flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>{t('guide.title')}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={language === 'bo' ? 'bo' : 'en'}
          className="flex min-h-0 flex-1 flex-col px-6 pb-6"
        >
          <TabsList className="shrink-0">
            <TabsTrigger value="en">{t('guide.english')}</TabsTrigger>
            <TabsTrigger value="bo">{t('guide.tibetan')}</TabsTrigger>
          </TabsList>

          <TabsContent value="en" className="min-h-0 flex-1">
            <iframe
              src={GUIDE_PDFS.en}
              className="h-full w-full rounded-md border border-border"
              title={`${t('guide.title')} - ${t('guide.english')}`}
            />
          </TabsContent>

          <TabsContent value="bo" className="min-h-0 flex-1">
            <iframe
              src={GUIDE_PDFS.bo}
              className="h-full w-full rounded-md border border-border"
              title={`${t('guide.title')} - ${t('guide.tibetan')}`}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
