import { UserRole } from '@/types'
import type { User } from '@/types'

export const users: User[] = [
  { id: 'u1',  username: 'Tenzin Norbu',    email: 'tenzin@example.com', role: UserRole.Admin,          groupId: 'g1' },
  { id: 'u2',  username: 'Pema Lhamo',      email: 'pema@example.com',   role: UserRole.Annotator,      groupId: 'g1' },

  { id: 'u3',  username: 'Sonam Gyatso',    email: 'sonam@example.com',  role: UserRole.Reviewer,       groupId: 'g2' },
  { id: 'u4',  username: 'Dolma Yangchen',  email: 'dolma@example.com',  role: UserRole.FinalReviewer,  groupId: 'g2' },

  { id: 'u5',  username: 'Lobsang Tsering', email: 'lobsang@example.com',role: UserRole.Admin,          groupId: 'g3' },
  { id: 'u6',  username: 'Yeshi Wangmo',    email: 'yeshi@example.com',  role: UserRole.Annotator,      groupId: 'g3' },

  { id: 'u7',  username: 'Ngawang Dorje',   email: 'ngawang@example.com',role: UserRole.Reviewer,       groupId: 'g4' },
  { id: 'u8',  username: 'Kalsang Choden',  email: 'kalsang@example.com',role: UserRole.FinalReviewer,  groupId: 'g4' },

  { id: 'u9',  username: 'Jigme Phuntsok',  email: 'jigme@example.com',  role: UserRole.Admin,          groupId: 'g5' },
  { id: 'u10', username: 'Deki Lhamo',      email: 'deki@example.com',   role: UserRole.Annotator,      groupId: 'g5' },

  { id: 'u11', username: 'Tashi Namgyal',   email: 'tashi@example.com',  role: UserRole.Reviewer,       groupId: 'g6' },
  { id: 'u12', username: 'Chime Dolkar',    email: 'chime@example.com',  role: UserRole.FinalReviewer,  groupId: 'g6' },

  { id: 'u13', username: 'Gyurme Tenzin',   email: 'gyurme@example.com', role: UserRole.Admin,          groupId: 'g7' },
  { id: 'u14', username: 'Sangmo Drolma',   email: 'sangmo@example.com', role: UserRole.Annotator,      groupId: 'g7' },

  { id: 'u15', username: 'Dorje Tsultrim',  email: 'dorje@example.com',  role: UserRole.Reviewer,       groupId: 'g8' },
  { id: 'u16', username: 'Yangzom Bhuti',   email: 'yangzom@example.com',role: UserRole.FinalReviewer,  groupId: 'g8' },

  { id: 'u17', username: 'Thupten Kunga',   email: 'thupten@example.com',role: UserRole.Admin,          groupId: 'g9' },
  { id: 'u18', username: 'Lhamo Tsering',   email: 'lhamo@example.com',  role: UserRole.Annotator,      groupId: 'g10' },
]

