'use client'

import React, { useState } from 'react'
import { CheckIcon, Plus, Search, Users } from 'lucide-react'
import { ClientForm } from '../../components/clients/ClientForm'
import ClientsGrid from '../../components/clients/ClientsGrid'
import { Alert, AlertColor, useTheme, Box, Skeleton } from '@mui/material'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import api from '@/lib/api'

export default function Clients() {
  const [showForm, setShowForm] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formMode, setFormMode] = useState<'edit' | 'view' | 'create'>('create')
  const [errorCPF, setErrorCPF] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [alertInfo, setAlertInfo] = useState<{
    visible: boolean
    message: string
    severity: AlertColor | undefined
  }>({
    visible: false,
    message: '',
    severity: undefined
  })
  const theme = useTheme()

  const getClients = async () => {
    try {
      let allClients: any[] = []
      let page = 1
      let hasMoreData = true

      while (hasMoreData) {
        const clientesResponse = await api.get(`clients?page=${page}`)
        const clientesData = clientesResponse.data

        if (clientesData.length === 0) {
          hasMoreData = false
        } else {
          allClients = [...allClients, ...clientesData]
          page++
        }
      }

      setClientes(allClients)
    } catch (err) {
      console.error('Erro ao buscar os dados:', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    getClients()
  }, [])

  const showAlert = (message: string, severity: AlertColor) => {
    setAlertInfo({
      visible: true,
      message,
      severity
    })

    setTimeout(() => {
      setAlertInfo({ visible: false, message: '', severity: undefined })
    }, 3000)
  }

  const handleView = (client: any) => {
    setSelectedClient(client)
    setFormMode('view')
    setShowForm(true)
  }

  const handleEdit = (client: any) => {
    setSelectedClient(client)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = (client: any) => {
    setDeleteModal(true)
    setSelectedClient(client)
  }

  const handleClose = () => {
    setShowForm(false)
    setSelectedClient(null)
    setFormMode('create')
    setErrorCPF('')
    setErrorEmail('')
  }

  const handleCloseModal = () => {
    setDeleteModal(false)
    selectedClient(null)
  }

  const handleCreateClient = async (data: any) => {
    console.log('handleCreateClient', data)
    try {
      setErrorCPF('')
      setErrorEmail('')
      const response = await api.post('clients', data)

      if (response.status === 200 || response.status === 201) {
        showAlert('Cliente cadastrado com sucesso.', 'success')
        setSelectedClient(null)
        setErrorCPF('')
        setErrorEmail('')
        handleClose()
      }
    } catch (error: unknown | any | Error) {
      console.error('Erro ao enviar a requisição:', error)
      if (error.response) {
        const errorMessage = error.response.data.message.message
        if (errorMessage === 'CPF already exists') {
          setErrorCPF('CPF já cadastrado.')
        }
        if (errorMessage === 'Email already exists') {
          setErrorEmail('Email já cadastrado.')
        }
      }
    } finally {
      getClients()
    }
  }

  const handleEditClient = async (data: any) => {
    try {
      setErrorCPF('')
      setErrorEmail('')
      const { id, ...dataWithoutId } = data
      const response = await api.put(`clients/${data.id}`, dataWithoutId)

      if (response.status === 200 || response.status === 201) {
        showAlert('Cliente atualizado com sucesso.', 'success')
        handleClose()
        setSelectedClient(null)
        setErrorCPF('')
        setErrorEmail('')
      }
    } catch (error: unknown | any | Error) {
      console.error('Erro ao enviar a requisição:', error)
      if (error.response) {
        const errorMessage = error.response.data.message.message
        if (errorMessage === 'CPF already exists') {
          setErrorCPF('CPF já cadastrado.')
        }
        if (errorMessage === 'Email already exists') {
          setErrorEmail('Email já cadastrado.')
        }
      }
    } finally {
      getClients()
    }
  }

  const handleDeleteClient = async () => {
    try {
      const response = await api.delete(`clients/${selectedClient.id}`)

      if (response.status === 200 || response.status === 201) {
        showAlert('Cliente excluído com sucesso.', 'success')
        setDeleteModal(false)
        setSelectedClient(null)
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error)
    } finally {
      getClients()
    }
  }

  return (
    <div
      className='max-w-7xl mx-auto py-8 px-4'
      style={{
        width: '100%'
      }}>
      <div
        style={{
          marginBottom: '1em'
        }}>
        {alertInfo.visible && alertInfo.severity && (
          <Alert variant='filled' icon={<CheckIcon fontSize='inherit' />} severity={alertInfo.severity}>
            {alertInfo.message}
          </Alert>
        )}
      </div>
      <div className='flex justify-between items-center mb-8 gap-6'>
        <h1 className='text-3xl font-bold'>Cadastro de Clientes</h1>
        <button
          onClick={() => {
            setSelectedClient(null)
            setFormMode('create')
            setShowForm(true)
          }}
          className="flex items-center px-4 py-2 rounded-lg bg-kai-primary hover:bg-kai-primary/70">
          <Plus className='w-5 h-5 mr-2' style={{
            color: theme.palette.mode === 'light' ? '#fff' : '#000'
          }} />
          <span
            style={{
              color: theme.palette.mode === 'light' ? '#fff' : '#000'
            }}
          >Novo Cliente
          </span>
        </button>
      </div>

      <div className='mb-6 relative max-w-md'>
        <input
          type='text'
          placeholder='Buscar clientes...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent'
        />
        <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
      </div>

      {loading ? (
        <Box>
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <Skeleton variant="rectangular" width="30%" height={40} />
              <Skeleton variant="rectangular" width="20%" height={40} />
              <Skeleton variant="rectangular" width="30%" height={40} />
              <Skeleton variant="rectangular" width="20%" height={40} />
            </div>
          ))}
        </Box>
      ) : clientes?.length !== 0 ? (
        <ClientsGrid
          clientes={clientes}
          onView={handleView}
          onEdit={handleEdit}
          searchQuery={searchQuery}
        />
      ) : (
        <div
          className="rounded-lg p-12 text-center"
          style={{
            border: theme.palette.mode === 'light'
              ? "1px solid rgba(229,231,235,255)"
              : "1px solid hsla(220, 20%, 25%, 0.6)"
          }}
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-500">
            Não há clientes cadastrados no sistema.
          </p>
        </div>
      )}

      {showForm && (
        <ClientForm
          client={selectedClient}
          onCreate={handleCreateClient}
          onEdit={handleEditClient}
          onCancel={handleClose}
          readOnly={false}
          cpfError={errorCPF}
          emailError={errorEmail}
        />
      )}

      {deleteModal && (
        <ConfirmationModal
          isOpen={deleteModal}
          onClose={handleCloseModal}
          onConfirm={handleDeleteClient}
          itemName={selectedClient?.name}
          itemType='perfil'
        />
      )}
    </div>
  )
}
