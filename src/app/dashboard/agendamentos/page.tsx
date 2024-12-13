"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search, Filter, CalendarPlus, ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';
import { AppointmentList } from '../../components/scheduling/AppointmentList';
import { AppointmentDashboard } from '../../components/scheduling/AppointmentDashboard';
import { CalendarView } from '../../components/scheduling/CalendarView';

export default function SchedulingList() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'list' | 'calendar'>('list');

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-kai-gray-900">
                    Consulta de Agendamentos
                </h1>
            </div>

            <AppointmentDashboard date={selectedDate} />

            <div className="mt-8 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePrevDay}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="font-medium">
                                {selectedDate.toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <button
                            onClick={handleNextDay}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
                            <button
                                onClick={() => setView('list')}
                                className={`px-3 py-1 rounded flex items-center ${view === 'list'
                                    ? 'bg-kai-primary/10 text-kai-primary'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <LayoutList className="w-5 h-5 mr-2" />
                                Lista
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`px-3 py-1 rounded flex items-center ${view === 'calendar'
                                    ? 'bg-kai-primary/10 text-kai-primary'
                                    : 'text-gray-600 hover:bg-gray-50'
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
                    date={selectedDate}
                />
            ) : (
                <AppointmentList
                    date={selectedDate}
                />
            )}
        </div>
    );
}