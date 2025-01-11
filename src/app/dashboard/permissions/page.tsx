'use client'

import React, { useState, useEffect } from 'react'
import { PlusIcon, Search } from 'lucide-react'
import { Role } from '../../types/permissions'
import AccessCard from './components/AccessCard'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import RolesTable from './components/RolesTable'
import RolePermissionForm from './components/forms/RolePermissionForm'
import api from '../../../lib/api'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { showToast } from '@/lib/toast'

export default function PermissionsManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const theme = useTheme()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles')
      setRoles(response)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setIsLoading(false)
    }
  }

  const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSave = async (updatedRole: Role) => {
    if (isSaving) return

    try {
      await fetchRoles() // Refresh the roles list
    } catch (error) {
      console.error('Error saving role:', error)
      // Handle error (show notification, etc.)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!roleToDelete || isSaving) return

    try {
      setIsSaving(true)
      await api.delete(`/roles/${roleToDelete.id}`)
      await fetchRoles() // Refresh the roles list
      setDeleteModalOpen(false)
      setRoleToDelete(null)
      showToast.success('Perfil deletado com sucesso')
    } catch (error) {
      console.error('Error deleting role:', error)
      // Handle error (show notification, etc.)
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, mode: 'grid' | 'list') => {
    if (mode) setViewMode(mode)
  }

  const handleView = (role: Role) => {
    setSelectedRole(role)
    setModalMode('view')
  }

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setModalMode('edit')
  }

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role)
    setDeleteModalOpen(true)
  }

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Typography variant='h4' component='h1' sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Gerenciamento de Permissões
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          marginBottom: 3,
          flexWrap: 'wrap'
        }}>
        <TextField
          variant='outlined'
          placeholder='Buscar perfis...'
          size='medium'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap'
          }}>
          {/* <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange} size='small'>
            <ToggleButton value='list'>
              <ListIcon size={20} />
            </ToggleButton>
            <ToggleButton value='grid'>
              <Grid size={20} />
            </ToggleButton>
          </ToggleButtonGroup> */}
          <Button
            onClick={() => {
              setSelectedRole(null)
              setModalMode('create')
            }}
            className="flex items-center px-4 py-2 rounded-lg bg-kai-primary hover:bg-kai-primary/70"
            startIcon={<PlusIcon style={{ color: theme.palette.mode === 'light' ? '#fff' : '#000' }} />}>
            <span style={{ color: theme.palette.mode === 'light' ? '#fff' : '#000' }}>
              Novo Perfil
            </span>
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'list' ? (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <RolesTable roles={filteredRoles} onView={handleView} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 2,
            width: '100%'
          }}>
          {filteredRoles.map(role => (
            <AccessCard
              key={role.id}
              role={role}
              onEdit={() => handleEdit(role)}
              onView={() => handleView(role)}
              onDelete={() => handleDeleteClick(role)}
            />
          ))}
        </Box>
      )}

      {modalMode && (
        <RolePermissionForm
          open={!!modalMode}
          onClose={() => {
            setModalMode(null)
            setSelectedRole(null)
          }}
          role={selectedRole}
          mode={modalMode}
          onSave={handleSave}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setRoleToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        itemName={roleToDelete?.name || ''}
        itemType='permissão'
      />
    </Box>
  )
}
