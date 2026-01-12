import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { groupSchema } from '@/schema/group-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

export interface GroupFormData {
  name: string;
  description?: string;
}

export interface GroupFormProps {
  defaultValues?: GroupFormData;
  onSubmit: (data: GroupFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function GroupForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
}: GroupFormProps) {
  const { t } = useTranslation('admin')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues ?? {
      name: '',
      description: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('groups.form.name')}</Label>
        <Input
          id="name"
          placeholder={t('groups.form.namePlaceholder')}
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('groups.form.description')}</Label>
        <Textarea
          id="description"
          placeholder={t('groups.form.descriptionPlaceholder')}
          rows={3}
          {...register('description')}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel || t('groups.form.save')}
        </Button>
      </div>
    </form>
  )
}

