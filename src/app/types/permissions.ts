export enum PermissionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum ResourceType {
  LAUDARIO = 'laudario',
  USER = 'user',
  ROLES = 'roles',
  AGENDA = 'agenda',
  CLIENTS = 'clients',
  WORKFLOW_PLANNED = 'workflow_planned',
  WORKFLOW_WAITING = 'workflow_waiting',
  WORKFLOW_STARTED = 'workflow_started',
  WORKFLOW_ON_HOLD = 'workflow_ON_HOLD',
  WORKFLOW_COMPLETED = 'workflow_completed',
  WORKFLOW_TRANSCRIPTION = 'workflow_transcription',
  WORKFLOW_SIGNED = 'workflow_signed'
}

export interface Permission {
  id: number
  permission: PermissionType
  resource: ResourceType
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}
