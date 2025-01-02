import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';

interface ServiceRequestMetrics {
  totalExams: number;
  occupancyRate: number;
  pendingExams: number;
  confirmedExams: number;
  confirmationRate: number;
  canceledExams: number;
  cancellationRate: number;
}

interface AppointmentDashboardProps {
  dateRange: [Date | null, Date | null];
}

function DashboardSkeleton({ theme }: { theme: any }) {
  const CardSkeleton = () => (
    <div
      className="rounded-xl border border-gray-200 p-6"
      style={{
        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
      }}
    >
      <div className="flex items-center">
        <Skeleton variant="rounded" width={40} height={40} />
        <div className="ml-4 flex-1">
          <Skeleton variant="text" width={120} height={20} />
          <div className="flex items-baseline mt-1">
            <Skeleton variant="text" width={60} height={32} />
            <Skeleton variant="text" width={40} height={20} className="ml-2" />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={40} height={20} />
        </div>
        <Skeleton variant="rounded" width="100%" height={8} className="mt-1" />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function AppointmentDashboard({ dateRange }: AppointmentDashboardProps) {
  const theme = useTheme();
  const [startDate, endDate] = dateRange;

  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data: metrics, isLoading } = useQuery<ServiceRequestMetrics>({
    queryKey: ['service-requests', 'metrics', startDate, endDate],
    queryFn: async () => {
      const formattedStartDate = startDate ? formatDateForApi(startDate) : '';
      const formattedEndDate = endDate ? formatDateForApi(endDate) : '';

      const response = await api.get('/service-requests/metrics', {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }
      });
      return response;
    },
    enabled: !!startDate && !!endDate
  });

  if (isLoading) {
    return <DashboardSkeleton theme={theme} />;
  }

  return (
    <div className="grid bg-transparent grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Appointments */}
      <div
        className="rounded-xl p-6"
        style={{
          border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
        }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-kai-primary/10 to-ka rounded-lg">
            <Calendar className="w-6 h-6 text-kai-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total de Exames</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-kai-text-primary mr-2">
                {metrics?.totalExams}
              </h3>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Taxa de ocupação</span>
            <span className="font-medium text-gray-900">{metrics?.occupancyRate ?? '--'}%</span>
          </div>
          <div className="mt-1 bg-kai-primary/10 rounded-full h-2">
            <div
              className="bg-kai-primary rounded-full h-2"
              style={{ width: `${metrics?.occupancyRate ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confirmed */}
      <div
        className="rounded-xl p-6"
        style={{
          border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
        }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-kai-primary/10 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-kai-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Iniciados</p>
            <h3 className="text-2xl font-bold tetext-kai-text-primary">
              {metrics?.confirmedExams ?? '--'}
            </h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Taxa de concluidos</span>
            <span className="font-medium text-gray-900">
              {metrics?.confirmationRate ?? '--'}%
            </span>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div
        className="rounded-xl p-6"
        style={{
          border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
        }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-kai-primary/10 rounded-lg">
            <Clock className="w-6 h-6 text-kai-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Com Pendências</p>
            <h3 className="text-2xl font-bold text-kai-text-primary">
              {metrics?.pendingExams ?? '--'}
            </h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Necessitam ação</span>
            <span className="font-medium text-kai-primary">
              Confirmar
            </span>
          </div>
        </div>
      </div>

      {/* Canceled */}
      <div
        className="rounded-xl p-6"
        style={{
          border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
        }}
      >
        <div className="flex items-center">
          <div className="p-2 bg-kai-primary/10 rounded-lg">
            <XCircle className="w-6 h-6 text-kai-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Cancelados</p>
            <h3 className="text-2xl font-bold text-kai-text-primary">
              {metrics?.canceledExams ?? '--'}
            </h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Taxa de cancelamento</span>
            <span className="font-medium text-gray-900">
              {metrics?.cancellationRate ?? '--'}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}