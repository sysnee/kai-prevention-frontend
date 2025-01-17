import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@mui/material';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const date = new Date(selectedDate);
    date.setDate(1);
    return date;
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const isSelectedDate = (day: number) => {
    return selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isPastDate = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div
      className="max-w-md mx-auto rounded-xl shadow-lg p-6"
      style={{
        border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d",
        backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#111827"
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-kai-primary/10 rounded-full transition-colors duration-200 text-kai-primary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-500">
          {currentMonth.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-kai-primary/10 rounded-full transition-colors duration-200 text-kai-primary"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
        {[...padding, ...days].map((day, index) => (
          <div key={index} className="aspect-square p-1">
            {day && (
              <button
                data-testid="calendar-day"
                onClick={() =>
                  onDateSelect(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      day
                    )
                  )
                }
                disabled={isPastDate(day)}
                className={`
                  w-full h-full flex items-center justify-center rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${isSelectedDate(day)
                    ? theme.palette.mode === 'light' ? 'bg-kai-primary text-white shadow-md scale-105' : 'bg-kai-primary text-black scale-105'
                    : isPastDate(day)
                      ? theme.palette.mode === 'light' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 cursor-not-allowed'
                      : theme.palette.mode === 'light' ? 'hover:bg-kai-primary/10 hover:text-kai-primary text-gray-800' : 'hover:bg-kai-primary/10 hover:text-kai-primary text-gray-300'
                  }
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}