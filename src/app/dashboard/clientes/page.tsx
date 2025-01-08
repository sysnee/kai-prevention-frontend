'use client'

import React, { useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { ClientForm } from '../../components/clients/ClientForm'
import ClientsGrid from '../../components/clients/ClientsGrid'
import { useTheme, Box, Skeleton } from '@mui/material'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function Clients() {
  const [showForm, setShowForm] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formMode, setFormMode] = useState<'edit' | 'view' | 'create'>('create')
  const theme = useTheme()
  const [formErrors, setFormErrors] = useState<{ cpf?: string; email?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleClose = () => {
    setShowForm(false)
    setSelectedClient(null)
    setFormMode('create')
    setFormErrors({})
  }

  const handleSave = async (data: any) => {
    setFormErrors({})
    try {
      setIsSubmitting(true)

      if (selectedClient) {
        await api.put(`/clients/${selectedClient.id}`, data)
      } else {
        await api.post('/clients', data)
      }

      toast.success(`Cliente ${selectedClient ? 'atualizado' : 'cadastrado'} com sucesso.`)
      setSelectedClient(null)
      handleClose()
      getClients()

    } catch (error: any) {
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
        toast.error(`Erro inesperado ao ${selectedClient ? 'atualizar' : 'salvar'} cliente`);
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className='max-w-7xl mx-auto py-8 px-4'
      style={{
        width: '100%'
      }}>
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
          onSubmit={handleSave}
          onCancel={handleClose}
          readOnly={formMode === 'view'}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
