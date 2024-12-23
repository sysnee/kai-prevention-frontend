"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, LayoutList, PlusIcon } from 'lucide-react';
import { AppointmentList } from '../../components/scheduling/AppointmentList';
import { AppointmentDashboard } from '../../components/scheduling/AppointmentDashboard';
import { CalendarView } from '../../components/scheduling/CalendarView';
import { Button } from '@mui/material';
import { useTheme } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { ptBR } from '@mui/x-date-pickers/locales';
import { ptBR as ptBRCore } from '@mui/material/locale';

export default function SchedulingList() {
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs(), dayjs()]);
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [loading, setLoading] = useState(true);

    const theme = useTheme()

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [dateRange]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-kai-gray-900">
                    Consulta de Agendamentos
                </h1>

                <Button
                    href='/dashboard/agendamentos/novo'
                    className="flex items-center px-4 py-2 rounded-lg bg-kai-primary hover:bg-kai-primary/70"
                    style={{
                        color: theme.palette.mode === 'light' ? "#fff" : "#000",
                    }}
                    startIcon={<PlusIcon />}>
                    Novo Agendamento
                </Button>
            </div>

            <AppointmentDashboard
                dateRange={[
                    dateRange[0]?.toDate() || null,
                    dateRange[1]?.toDate() || null
                ]}
            />

            <div className="mt-8 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="pt-br"
                            localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
                        >
                            <div className="flex gap-4">
                                <DatePicker
                                    label="Data inicial"
                                    value={dateRange[0]}
                                    onChange={(newValue) => {
                                        setDateRange([newValue, dateRange[1]]);
                                        setLoading(true);
                                    }}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: { size: 'small' },
                                        inputAdornment: {
                                            sx: {
                                                '& .MuiIconButton-root': {
                                                    padding: '4px',
                                                    marginRight: '1px',
                                                    width: '20px',
                                                    height: '20px',
                                                    '& svg': {
                                                        color: '#FF8046'
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    sx={{ width: 200 }}
                                />
                                <DatePicker
                                    label="Data final"
                                    value={dateRange[1]}
                                    onChange={(newValue) => {
                                        setDateRange([dateRange[0], newValue]);
                                        setLoading(true);
                                    }}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: { size: 'small' },
                                        inputAdornment: {
                                            sx: {
                                                '& .MuiIconButton-root': {
                                                    padding: '4px',
                                                    marginRight: '1px',
                                                    width: '20px',
                                                    height: '20px',
                                                    '& svg': {
                                                        color: '#FF8046'
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    sx={{ width: 200 }}
                                />
                            </div>
                        </LocalizationProvider>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div
                            className="flex rounded-lg p-1 gap-2"
                            style={{
                                border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d"
                            }}
                        >
                            <button
                                onClick={() => setView('list')}
                                className={`px-3 py-1 rounded flex items-center ${view === 'list'
                                    ? 'bg-kai-primary/10 text-kai-primary'
                                    : 'text-gray-600 hover:bg-kai-primary/10'
                                    }`}
                            >
                                <LayoutList className="w-5 h-5 mr-2" />
                                Lista
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`px-3 py-1 rounded flex items-center ${view === 'calendar'
                                    ? 'bg-kai-primary/10 text-kai-primary'
                                    : 'text-gray-600 hover:bg-kai-primary/10'
                                    }`}
                            >
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                Calendário
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {view === 'calendar' ? (
                <CalendarView
                    dateRange={[
                        dateRange[0]?.toDate() || null,
                        dateRange[1]?.toDate() || null
                    ]}
                />
            ) : (
                <AppointmentList
                    dateRange={[
                        dateRange[0]?.toDate() || null,
                        dateRange[1]?.toDate() || null
                    ]}
                />
            )}
        </div>
    );
}