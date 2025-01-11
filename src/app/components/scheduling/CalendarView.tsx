import React, { useEffect, useState } from 'react';
import { Clock, User, AlertCircle, CalendarX } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import api from '@/lib/api';

interface CalendarViewProps {
  dateRange: [Date | null, Date | null];
}

interface Appointment {
  id: string;
  clientCpf: string;
  clientName: string;
  dateTime: string;
  examType: string;
  status: string;
  questionnaireIsPending: boolean;
  createdAt: string;
}

export function CalendarView({ dateRange }: CalendarViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const translateStatus = (status: string): string => {
    const translations: { [key: string]: string } = {
      PLANNED: "Planejado",
      CONFIRMED: "Confirmado",
      CANCELED: "Cancelado",
    };
    return translations[status] || status;
  };

  // Função para formatar a data
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const startDate = dateRange[0] ? formatDateForApi(dateRange[0]) : ''
      const endDate = dateRange[1] ? formatDateForApi(dateRange[1]) : ''

      const { data } = await api.get("service-requests", {
        params: {
          startDate,
          endDate
        }
      });
      setAppointments(data);
    } catch (err) {
      console.error("Erro ao buscar os dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchAppointments();
    }
  }, [dateRange[0], dateRange[1]]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const filterAppointmentsByDateRange = (appointments: Appointment[]) => {
    if (!dateRange[0] || !dateRange[1]) return appointments

    const startDate = new Date(dateRange[0])
    const endDate = new Date(dateRange[1])

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    return appointments.filter(appointment => {
      const [datePart, timePart] = appointment.dateTime.split(', ')
      const [day, month, year] = datePart.split('/')
      const [hours, minutes] = timePart.split(':')

      const appointmentDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      )

      return appointmentDate >= startDate && appointmentDate <= endDate
    })
  }

  const filteredAppointments = filterAppointmentsByDateRange(appointments)

  if (loading) {
    return <CircularProgress />;
  }


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

  return (
    <div
      className="rounded-lg"
      style={{
        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
      }}
    >
      <div className={`grid grid-cols-1 divide-y ${theme.palette.mode === 'light' ? 'divide-gray-200' : 'divide-gray-800'}`}
      >
        {filteredAppointments.map((appointment) => {

          return (
            <div
              key={appointment.id}
              className={`min-h-[80px] grid grid-cols-[120px,1fr]`}
            >
              <div
                className="p-4 flex items-center"
                style={{
                  borderRight: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
                }}
              >
                <Clock className={`w-4 h-4 mr-2 'text-gray-400'}`} />
                <span className={`font-medium 'text-gray-600'}`}>
                  {appointment.dateTime}
                </span>
              </div>
              <div className="p-2">
                <div className={`h-full p-3 rounded-lg border ${getStatusColor(appointment.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">{appointment.clientName}</div>
                        <div className="text-sm">{appointment.examType}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {translateStatus(appointment.status)}
                    </span>
                  </div>
                  {appointment.questionnaireIsPending && (
                    <div className="mt-2 flex items-start text-sm">
                      <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                      Questionário pendente
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
