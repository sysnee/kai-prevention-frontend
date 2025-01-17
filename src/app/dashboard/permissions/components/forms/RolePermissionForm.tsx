'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@mui/system';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material'
import { X } from 'lucide-react'
import api from '../../../../../lib/api'
import { Role } from '@/app/types/permissions'
import { PermissionType } from '@/app/types/permissions'
import toast from 'react-hot-toast'
import { PERMISSION_TRANSLATIONS, RESOURCE_TRANSLATIONS } from '@/app/constants/translations'
import { ResourceType } from '@/app/types/permissions'

interface RoleFormData {
  name: string
  permissions: {
    permission: PermissionType
    resource: ResourceType
  }[]
}

interface RolePermissionFormProps {
  open: boolean
  onClose: () => void
  role: Role | null
  mode: 'create' | 'edit' | 'view'
  onSave: (role: RoleFormData) => void
}

export default function RolePermissionForm({ open, onClose, role, mode, onSave }: RolePermissionFormProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    permissions: []
  })
  const [error, setError] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<ResourceType | ''>('')
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionType[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        permissions: role.permissions.map(p => ({
          permission: p.permission,
          resource: p.resource
        }))
      })
    } else {
      setFormData({
        name: '',
        permissions: []
      })
    }
  }, [role])

  const isViewMode = mode === 'view'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setError(null)

    if (!formData.name) {
      setError('Nome do perfil é obrigatório')
      return
    }
    if (formData.permissions.length === 0) {
      setError('Adicione pelo menos uma permissão')
      return
    }

    try {
      setIsLoading(true)

      const payload = {
        name: formData.name,
        permissions: formData.permissions.map(p => ({
          permission: p.permission.toLowerCase(),
          resource: p.resource.toLowerCase()
        }))
      }

      if (mode === 'create') {
        await api.post('/roles', payload)
      } else if (mode === 'edit' && role) {
        await api.patch(`/roles/${role.id}`, payload)
      }

      toast.success('Perfil salvo com sucesso')

      onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar o perfil')
      toast.error('Erro ao salvar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPermissions = () => {
    if (selectedResource && selectedPermissions.length > 0) {
      const newPermissions = selectedPermissions.map(permission => ({
        permission,
        resource: selectedResource
      }))

      // Filter out any existing permissions for this resource
      const filteredPermissions = formData.permissions.filter(p => p.resource !== selectedResource)

      setFormData(prev => ({
        ...prev,
        permissions: [...filteredPermissions, ...newPermissions]
      }))
      setSelectedResource('')
      setSelectedPermissions([])
      setError(null)
    }
  }

  const handlePermissionChange = (permission: PermissionType) => {
    setSelectedPermissions(prev =>
      prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
    )
  }

  const handleRemoveResourcePermissions = (resource: ResourceType) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.filter(p => p.resource !== resource)
    }))
  }

  const groupPermissionsByResource = (permissions: RoleFormData['permissions']) => {
    const grouped = new Map<ResourceType, PermissionType[]>()
    permissions.forEach(({ resource, permission }) => {
      const existing = grouped.get(resource) || []
      grouped.set(resource, [...existing, permission])
    })
    return grouped
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant='h6'>
            {mode === 'create' ? 'Criar novo perfil' : mode === 'edit' ? 'Editar perfil' : 'Visualizar perfil'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            {error && <Alert severity='error'>{error}</Alert>}

            <TextField
              label='Nome do perfil'
              fullWidth
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isViewMode}
              required
              error={isSubmitted && !formData.name}
              helperText={isSubmitted && !formData.name ? 'Nome é obrigatório' : ''}
            />

            <Divider />

            <Box>
              <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                Permissões
              </Typography>

              {!isViewMode && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Recurso</InputLabel>
                    <Select
                      value={selectedResource}
                      label='Recurso'
                      onChange={e => setSelectedResource(e.target.value as ResourceType)}>
                      {Object.entries(RESOURCE_TRANSLATIONS).map(([resource, translation]) => (
                        <MenuItem key={resource} value={resource}>
                          {translation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedResource && (
                    <>
                      <FormGroup row>
                        {Object.entries(PERMISSION_TRANSLATIONS).map(([permission, translation]) => (
                          <FormControlLabel
                            key={permission}
                            control={
                              <Checkbox
                                checked={selectedPermissions.includes(permission as PermissionType)}
                                onChange={() => handlePermissionChange(permission as PermissionType)}
                              />
                            }
                            label={translation}
                          />
                        ))}
                      </FormGroup>

                      <Button
                        variant='contained'
                        onClick={handleAddPermissions}
                        color='primary'
                        disabled={selectedPermissions.length === 0}>
                        Adicionar Permissões
                      </Button>
                    </>
                  )}
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Array.from(groupPermissionsByResource(formData.permissions)).map(([resource, permissions]) => (
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
                        />
                      ))}
                    </Box>
                    {!isViewMode && (
                      <Button
                        size='small'
                        color='error'
                        onClick={() => handleRemoveResourcePermissions(resource)}
                        startIcon={<X size={16} />}>
                        Remover
                      </Button>
                    )}
                  </Box>
                ))}
                {formData.permissions.length === 0 && (
                  <Typography color='text.secondary' variant='body2'>
                    Nenhuma permissão adicionada
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            disabled={isLoading}
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
              border: "1px solid #e5e7eb"
            })}
            className="text-kai-primary transition-colors hover:bg-kai-primary/10"
          >
            {isViewMode ? 'Fechar' : 'Cancelar'}
          </Button>
          {!isViewMode && (
            <Button type='submit' disabled={isLoading} className="bg-kai-primary hover:bg-kai-primary/70">
              <span style={{ color: theme.palette.mode === 'light' ? '#fff' : '#000' }}>
                {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Salvar'}
              </span>
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}
