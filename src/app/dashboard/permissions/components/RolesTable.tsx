'use client'

import React from 'react'
import { useTheme } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography
} from '@mui/material'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import { Role, PermissionType, ResourceType } from '../../../types/permissions'

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

interface RolesTableProps {
  roles: Role[]
  onView: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

const groupPermissionsByResource = (permissions: Role['permissions']) => {
  const grouped = new Map<ResourceType, PermissionType[]>()
  permissions.forEach(({ resource, permission }) => {
    const existing = grouped.get(resource) || []
    grouped.set(resource, [...existing, permission])
  })
  return grouped
}

export default function RolesTable({ roles, onView, onEdit, onDelete }: RolesTableProps) {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 'none',
        backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
        '& .MuiTable-root': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
        }
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Nome do Perfil</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Permissões</TableCell>
            <TableCell align='right' sx={{ fontWeight: 600 }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map(role => (
            <TableRow key={role.id} hover>
              <TableCell sx={{ width: '200px' }}>
                <Typography variant='subtitle1' fontSize={16}>
                  {role.name}
                </Typography>
              </TableCell>
              <TableCell>
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
                      <Typography variant='subtitle2' sx={{ minWidth: 200 }}>
                        {RESOURCE_TRANSLATIONS[resource]}:
                      </Typography>
                      <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {permissions.map(permission => (
                          <Chip
                            key={`${resource}-${permission}`}
                            label={PERMISSION_TRANSLATIONS[permission]}
                            size='small'
                            sx={{ fontSize: '0.75rem' }}
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
              </TableCell>
              <TableCell
                align='right'
                sx={{
                  verticalAlign: 'middle',
                  width: '120px',
                  height: '100%'
                }}
              >
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <IconButton
                    size='small'
                    onClick={() => onView(role)}
                    sx={{ p: 0 }}
                  >
                    <Eye size={20} className="text-kai-primary hover:opacity-70" />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => onEdit(role)}
                    sx={{ p: 0 }}
                  >
                    <Edit2 size={20} className="text-kai-primary hover:opacity-70" />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => onDelete(role)}
                    sx={{ p: 0 }}
                  >
                    <Trash2 size={20} className="text-kai-primary hover:opacity-70" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
