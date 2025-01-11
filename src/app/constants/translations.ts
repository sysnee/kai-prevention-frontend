import { PermissionType, ResourceType } from '../types/permissions'
import { OTHER_PROFESSIONAL_ROLES, PROFESSIONAL_TYPES } from '../types/user'

export const PERMISSION_TRANSLATIONS = {
  [PermissionType.CREATE]: 'Criar',
  [PermissionType.READ]: 'Visualizar',
  [PermissionType.UPDATE]: 'Editar',
  [PermissionType.DELETE]: 'Excluir'
} as const

export const RESOURCE_TRANSLATIONS = {
  [ResourceType.LAUDARIO]: 'Laudário',
  [ResourceType.USER]: 'Usuário',
  [ResourceType.ROLES]: 'Perfis',
  [ResourceType.AGENDA]: 'Agenda',
  [ResourceType.CLIENTS]: 'Clientes',
  [ResourceType.WORKFLOW_PLANNED]: 'Workflow - Planejado',
  [ResourceType.WORKFLOW_WAITING]: 'Workflow - Aguardando',
  [ResourceType.WORKFLOW_STARTED]: 'Workflow - Iniciado',
  [ResourceType.WORKFLOW_ON_HOLD]: 'Workflow - Em Espera',
  [ResourceType.WORKFLOW_COMPLETED]: 'Workflow - Concluído',
  [ResourceType.WORKFLOW_TRANSCRIPTION]: 'Workflow - Transcrição',
  [ResourceType.WORKFLOW_SIGNED]: 'Workflow - Assinado'
} as const

export const TABLE_HEADERS = {
  name: 'Nome',
  email: 'Email',
  profile: 'Perfil',
  profession: 'Profissão',
  actions: 'Ações'
} as const

export const USER_MANAGEMENT = {
  title: 'Gerenciamento de Usuários',
  searchPlaceholder: 'Buscar usuários...',
  newUser: 'Novo Usuário',
  loading: 'Carregando...',
  deleteConfirmation: 'Tem certeza que deseja excluir este usuário?'
} as const

export function getProfessionalTypeName(professionalType: string | undefined): string {
  if (!professionalType) return '-'

  // Check in PROFESSIONAL_TYPES
  const professionalTypeMatch = PROFESSIONAL_TYPES.find(type => type.id === professionalType)
  if (professionalTypeMatch) return professionalTypeMatch.name

  // Check in OTHER_PROFESSIONAL_ROLES
  const otherTypeMatch = OTHER_PROFESSIONAL_ROLES.find(type => type.id === professionalType)
  if (otherTypeMatch) return otherTypeMatch.name

  return '-'
}
