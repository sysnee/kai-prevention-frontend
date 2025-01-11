'use client'

import React, { useState, useEffect } from 'react'

import api from '../../../lib/api'
import { UserForm } from './components/user-form'
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { User } from '../../types/user'
import { Role } from '../../types/permissions'
import toast from 'react-hot-toast'
import { useTheme } from '@mui/system'
import { getProfessionalTypeName } from '../../constants/translations'; // Ajuste o caminho conforme necessário
import ActionButtons from '../permissions/components/ActionButtons'
import { Plus, Search } from 'lucide-react'
import { PlusOne } from '@mui/icons-material'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserForm, setShowUserForm] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formMode, setFormMode] = useState<'edit' | 'view' | 'create'>('create')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formErrors, setFormErrors] = useState<{ cpf?: string; email?: string }>({})

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const theme = useTheme()

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setIsLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles')
      setRoles(response)
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const filteredUsers = users.filter(
    user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleView = (user: User) => {
    setSelectedUser(user)
    setFormMode('view')
    setShowUserForm(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormMode('edit')
    setShowUserForm(true)
  }

  const handleClose = () => {
    setShowUserForm(false)
    setFormErrors({})
    setSelectedUser(null)
    setFormMode('create')
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setShowConfirmationModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      if (!selectedUser?.id) return
      setIsDeleting(true)

      await api.delete(`/users/${selectedUser.id}`)
      toast.success('Usuário deletado com sucesso')
      fetchUsers()
      setShowConfirmationModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      toast.error('Erro ao deletar usuário')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Nome',
      flex: 0.4,
      minWidth: 250,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {params.row.fullName}
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.4,
      minWidth: 250,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {params.row.email}
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Perfil',
      flex: 0.4,
      minWidth: 150,
      renderCell: (params: any) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {params.row.role?.name}
        </Box>
      ),
    },
    {
      field: 'professionalType',
      headerName: 'Profissão',
      flex: 0.4,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {getProfessionalTypeName(params.value)}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.4,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          <ActionButtons
            onView={() => handleView(params.row)}
            onEdit={() => handleEdit(params.row)}
            onDelete={() => handleDeleteClick(params.row)}
          />
        </Box>
      ),
    },
  ]

  const handleSave = async (user: User) => {
    setFormErrors({})
    try {
      if (selectedUser) {
        await api.patch(`/users/${selectedUser.id}`, user)
      } else {
        await api.post('/users', user)
      }

      toast.success('Usuário salvo com sucesso')
      fetchUsers()
      setFormErrors({})
      setShowUserForm(false)
      setSelectedUser(null)
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error)

      try {
        const parsedError = JSON.parse(error.message.replace('API Error: ', ''));
        const errorMessage = parsedError.message?.message || 'Erro desconhecido';

        if (errorMessage.includes('CPF already exists')) {
          setFormErrors({ cpf: 'CPF já cadastrado' })
        } else if (errorMessage.includes('Email already exists')) {
          setFormErrors({ email: 'Email já cadastrado' })
        } else {
          toast.error(errorMessage);
        }
      } catch (parseError) {
        console.error('Erro ao interpretar a mensagem de erro:', parseError);
        toast.error('Erro inesperado ao salvar usuário');
      }
    }
  }

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Typography variant='h4' component='h1' sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Gerenciamento de Usuários
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, marginBottom: 3, flexWrap: 'wrap' }}>
        <TextField
          variant='outlined'
          placeholder='Buscar usuários...'
          size='medium'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />
          }}
        />
        <Button
          onClick={() => {
            setSelectedUser(null)
            setShowUserForm(true)
          }}
          className="flex items-center px-4 py-2 rounded-lg text-white bg-kai-primary hover:bg-kai-primary/70"
          style={{
            color: theme.palette.mode === 'light' ? '#fff' : '#000'
          }}
          startIcon={<Plus />}>
          Novo Usuário
        </Button>
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        filteredUsers.length > 0 &&
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          sx={{
            '.MuiDataGrid-columnHeaders': {
              fontSize: '15px',
            },
            '.MuiDataGrid-columnHeader': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
            },
            '.MuiDataGrid-columnHeaderTitle': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
            },
            '.MuiDataGrid-footerContainer': {
              backgroundColor: 'transparent !important',
              fontSize: '15px',
            },
            '.MuiDataGrid-cell': {
              fontSize: '15px',
            },
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
            borderColor: theme.palette.mode === 'dark' ? 'hsla(220, 20%, 25%, 0.6)' : 'inherit',
          }}
          localeText={{
            MuiTablePagination: {
              labelDisplayedRows: ({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`,
              labelRowsPerPage: "Linhas por página",
            },
          }}
        />
      )}

      {showUserForm && (
        <UserForm
          user={selectedUser}
          roles={roles}
          onCancel={handleClose}
          onSubmit={handleSave}
          readOnly={formMode === 'view'}
          formErrors={formErrors}
        />
      )}

      {showConfirmationModal && (
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedUser?.fullName || ''}
          itemType="usuário"
          isDeleting={isDeleting}
        />
      )}
    </Box>
  )
}
