import React, { useState } from 'react';
import { X, Calendar, Clock, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '@mui/material/styles';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string, reason: string) => void;
}

export function RescheduleModal({ isOpen, onClose, onConfirm }: RescheduleModalProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Mock available times - replace with actual API call
  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', 
    '10:30', '11:00', '11:30', '14:00', '14:30', 
    '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && reason) {
      onConfirm(selectedDate, selectedTime, reason);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="rounded-lg p-6 max-w-md w-full mx-4"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Reagendar Exame</h3>
          <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nova Data
            </label>
            <div className="relative">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent"
                required
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Novo Horário
            </label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent"
                required
              >
                <option value="">Selecione um horário</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Motivo do Reagendamento
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent"
              placeholder="Informe o motivo do reagendamento..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="border px-4 py-2 text-sm font-medium bg-kai-primary rounded-lg hover:bg-kai-primary/90 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}