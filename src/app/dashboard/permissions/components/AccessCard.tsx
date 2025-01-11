'use client'

import React from 'react'
import { Card, CardContent, Typography, IconButton, Box, Divider, Chip } from '@mui/material'

import { Eye, Edit2, Trash2 } from 'lucide-react'
import { PermissionType, Role, ResourceType } from '@/app/types/permissions'

const PERMISSION_TRANSLATIONS = {
  [PermissionType.CREATE]: 'Criar',
  [PermissionType.READ]: 'Visualizar',
  [PermissionType.UPDATE]: 'Editar',
  [PermissionType.DELETE]: 'Excluir'
} as const

const RESOURCE_TRANSLATIONS = {
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

interface AccessCardProps {
  role: Role
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

const groupPermissionsByResource = (permissions: Role['permissions']) => {
  const grouped = new Map<ResourceType, PermissionType[]>()
  permissions.forEach(({ resource, permission }) => {
    const existing = grouped.get(resource) || []
    grouped.set(resource, [...existing, permission])
  })
  return grouped
}

export default function AccessCard({ role, onView, onEdit, onDelete }: AccessCardProps) {
  if (!role) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            Dados do perfil não disponíveis
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant='h6' component='h2'>
            {role.name}
          </Typography>
          <Box>
            <IconButton size='small' onClick={onView}>
              <Eye size={20} />
            </IconButton>
            <IconButton size='small' onClick={onEdit}>
              <Edit2 size={20} />
            </IconButton>
            <IconButton size='small' onClick={onDelete}>
              <Trash2 size={20} />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Array.from(groupPermissionsByResource(role.permissions || [])).map(([resource, permissions]) => (
            <Box
              key={resource}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}>
              <Typography variant='subtitle2' sx={{ minWidth: 200, fontWeight: 600 }}>
                {RESOURCE_TRANSLATIONS[resource]}:
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {permissions.map(permission => (
                  <Chip
                    key={`${resource}-${permission}`}
                    label={PERMISSION_TRANSLATIONS[permission]}
                    size='small'
                    sx={{
                      fontSize: '0.75rem',
                      backgroundColor: theme => {
                        switch (permission) {
                          case PermissionType.CREATE:
                            return theme.palette.success.light
                          case PermissionType.READ:
                            return theme.palette.info.light
                          case PermissionType.UPDATE:
                            return theme.palette.warning.light
                          case PermissionType.DELETE:
                            return theme.palette.error.light
                          default:
                            return theme.palette.grey[300]
                        }
                      },
                      color: 'white'
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
          {(!role.permissions || role.permissions.length === 0) && (
            <Typography color='text.secondary' variant='body2'>
              Nenhuma permissão adicionada
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
