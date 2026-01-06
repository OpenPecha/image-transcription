import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole, type Group } from '@/types'
import { useTranslation } from 'react-i18next'
import { getRoleTranslationKey } from '@/lib/utils'

interface UserFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleFilterChange: (value: string) => void
  groupFilter: string
  onGroupFilterChange: (value: string) => void
  groups: Group[]
}

const ALL_ROLES = 'all'
const ALL_GROUPS = 'all'

export function UserFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  groupFilter,
  onGroupFilterChange,
  groups,
}: UserFiltersProps) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('users.searchUsers')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={tCommon('filters.role')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLES}>{tCommon('filters.allRoles')}</SelectItem>
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                { tCommon(`roles.${getRoleTranslationKey(role)}`) }
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={groupFilter} onValueChange={onGroupFilterChange}>
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={tCommon('filters.group')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_GROUPS}>{tCommon('filters.allGroups')}</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

