'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import api from '../../../lib/api'
import { UserForm } from './components/user-form'
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { User } from '../../types/user'
import { Role } from '../../types/permissions'
import { showToast } from '../../../lib/toast'
import { useTheme } from '@mui/system'
import { getProfessionalTypeName } from '../../constants/translations'; // Ajuste o caminho conforme necessário

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserForm, setShowUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Nome', flex: 0.4, minWidth: 250 },
    { field: 'email', headerName: 'Email', flex: 0.4, minWidth: 250 },
    {
      field: 'role',
      headerName: 'Perfil',
      flex: 0.4,
      minWidth: 150,
      valueGetter: (params: any) => {
        if (!params.row) return 'Sem role';
        const roleName = params.row.role?.name;
        return roleName ? roleName : '-';
      }
    },
    {
      field: 'professionalType',
      headerName: 'Profissão',
      flex: 0.4,
      minWidth: 150,
      valueGetter: (params: any) => {
        if (!params.row) return '-';
        const professionalType = params.row.professionalType;
        return professionalType ? getProfessionalTypeName(professionalType) : '-';
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.4,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => handleEdit(params.row)} color='primary' size='small'>Editar</Button>
          <Button onClick={() => handleDelete(params.row.id)} color='error' size='small'>Excluir</Button>
        </Box>
      ),
    },
  ]

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await api.delete(`/users/${userId}`);
      showToast.success('Usuário deletado com sucesso');
      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handleSave = async (user: User) => {
    try {
      if (selectedUser) {
        await api.patch(`/users/${selectedUser.id}`, user);
      } else {
        await api.post('/users', user);
      }

      showToast.success('Usuário salvo com sucesso');
      fetchUsers();
      setShowUserForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const onSubmit = async (data: User) => {
    try {
      const submitData = {
        fullName: data.fullName,
        birthDate: data.birthDate,
        gender: data.gender,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        status: data.status,
        roleId: data.roleId,
        isHealthcareProfessional: data.isHealthcareProfessional,
        professionalType: data.professionalType,
        registrationNumber: data.isHealthcareProfessional ? data.registrationNumber : null
      };

      await handleSave(submitData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    }
  };

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
          className={`flex items-center px-4 py-2 rounded-lg text-white
            ${theme.palette.mode === 'light' ? 'bg-kai-primary hover:bg-kai-primary/40' : 'bg-gray-600 hover:bg-gray-700'}
          `}
          startIcon={<Plus />}>
          Novo Usuário
        </Button>
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
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
          onSave={handleSave}
          onCancel={() => {
            setShowUserForm(false)
            setSelectedUser(null)
          }}
          onSubmit={onSubmit}
        />
      )}
    </Box>
  )
}
