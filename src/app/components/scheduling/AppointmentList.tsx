import React, { useEffect, useState } from 'react';
import { Clock, User, Edit2, Trash2, CalendarX, Eye } from 'lucide-react';
import { Box, Skeleton } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { ServiceRequest, useWorkflowStore } from '../../stores/workflowStore'
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation'
import api from '@/lib/api';
import { translateStatus } from '@/app/utils/translations';

// Interface do componente
interface AppointmentListProps {
  dateRange: [Date | null, Date | null];
}

// Interface para os dados do agendamento
interface Appointment {
  id: string;
  clientCpf: string;
  clientName: string;
  dateTime: string;
  examType: string;
  status: string;
  questionnaireIsPending: boolean;
  createdAt: string;
  code: string;
}

export function AppointmentList({ dateRange }: AppointmentListProps) {
  // Estado para armazenar os agendamentos e o status de carregamento
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const router = useRouter()

  const { setSelectedAppointment } = useWorkflowStore()

  const handleSelectAppointment = (appointment: ServiceRequest) => {
    setSelectedAppointment(appointment)
    router.push(`/dashboard/workflow?code=${appointment.code}`)
  };

  // Função para formatar a data
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Função de busca de agendamentos na API
  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const startDate = dateRange[0] ? formatDateForApi(dateRange[0]) : ''
      const endDate = dateRange[1] ? formatDateForApi(dateRange[1]) : ''

      const { data } = await api.get("service-requests", {
        params: {
          startDate,
          endDate
        }
      })
      setAppointments(data)
    } catch (err) {
      console.error("Erro ao buscar os dados:", err)
    } finally {
      setLoading(false)
    }
  }

  // Função auxiliar para formatar data para a API
  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Atualizar o useEffect para depender das datas
  useEffect(() => {
    fetchAppointments()
  }, [dateRange[0], dateRange[1]])

  const formattedDate = formatDate(dateRange[0] || new Date());

  // Atualizar a função de filtragem para lidar corretamente com o formato de data da API
  const filterAppointmentsByDateRange = (appointments: Appointment[]) => {
    if (!dateRange[0] || !dateRange[1]) return appointments

    const startDate = new Date(dateRange[0])
    const endDate = new Date(dateRange[1])

    // Zerar as horas para comparação apenas das datas
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    return appointments.filter(appointment => {
      // Converter a string de data do appointment para objeto Date
      // Assumindo que appointment.dateTime está no formato "DD/MM/YYYY, HH:mm"
      const [datePart, timePart] = appointment.dateTime.split(', ')
      const [day, month, year] = datePart.split('/')
      const [hours, minutes] = timePart.split(':')

      const appointmentDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Mês em JS começa em 0
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      )

      return appointmentDate >= startDate && appointmentDate <= endDate
    })
  }

  // Substituir o filtro existente pelo novo
  const filteredAppointments = filterAppointmentsByDateRange(appointments)

  // Caso os dados estejam carregando, mostra o esqueleto
  if (loading) {
    return (
      <Box>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <Skeleton variant="rectangular" width="10%" height={40} />
            <Skeleton variant="rectangular" width="30%" height={40} />
            <Skeleton variant="rectangular" width="20%" height={40} />
            <Skeleton variant="rectangular" width="20%" height={40} />
            <Skeleton variant="rectangular" width="20%" height={40} />
          </div>
        ))}
      </Box>
    );
  }

  // Caso não haja agendamentos filtrados, exibe uma mensagem
  if (filteredAppointments.length === 0) {
    return (
      <div
        className="rounded-lg p-12 text-center"
        style={{
          border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
        }}
      >
        <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          Nenhum agendamento encontrado
        </h3>
        <p className="text-gray-500">
          Não há agendamentos para esta data.
        </p>
      </div>
    );
  }

  // Definindo as colunas do DataGrid
  const columns: GridColDef[] = [
    {
      field: 'clientName',
      headerName: 'Paciente',
      renderCell: (params) => (
        <div className="col-span-2 flex items-center">
          <User className="w-8 h-8 text-gray-400 mr-3" />
          {params.row.clientName}
        </div>
      ),
      minWidth: 400,
      flex: 0.4
    },
    { field: 'dateTime', headerName: 'Data e hora', minWidth: 100, flex: 0.4 },
    { field: 'examType', headerName: 'Exame', minWidth: 150, flex: 0.4 },
    {
      field: 'status',
      headerName: 'Situação',
      renderCell: (params) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${params.row.status === 'CONFIRMADO'
          ? 'bg-green-100 text-green-800'
          : params.row.status === 'PLANEJADO'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
          }`}>
          {params.row.status}
        </span>
      ),
      minWidth: 150,
      flex: 0.4
    },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <button
            className="hover:opacity-70"
            onClick={() => handleSelectAppointment(params.row)}
          >
            <Eye className="w-5 h-5 text-kai-primary" />
          </button>
        </div>
      ),
      minWidth: 200,
      flex: 0.4
    },
  ];

  // Preparando as linhas do DataGrid
  const rows: GridRowsProp = filteredAppointments.map((appointment) => ({
    id: appointment.id,
    code: appointment.code,
    dateTime: appointment.dateTime,
    clientName: appointment.clientName,
    examType: appointment.examType,
    status: translateStatus(appointment.status),
  }));

  const labelDisplayedRows = ({ from, to, count }: any) => {
    return `${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`;
  };

  return (
    <div className="rounded-md">
      <Box>
        <DataGrid
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
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          localeText={{
            MuiTablePagination: {
              labelDisplayedRows,
              labelRowsPerPage: "Linhas por página",
            },
          }}
        />
      </Box>
    </div>
  );
}
