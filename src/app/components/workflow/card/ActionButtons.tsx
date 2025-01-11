import React from 'react';
import { Calendar, XCircle, PlayCircle, PauseCircle, ArrowRightCircle } from 'lucide-react';
import { ServiceStatus } from '@/app/types/pemissions/permissions';

interface ActionButtonsProps {
  status: ServiceStatus;
  onReschedule: () => void;
  onCancel: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onProceed?: () => void;
  resumeReason?: string;
  showResumeInput?: boolean;
  onResumeReasonChange?: (reason: string) => void;
  onShowResumeInput?: () => void;
}

export function ActionButtons({
  status,
  onReschedule,
  onCancel,
  onPause,
  onResume,
  onProceed,
  resumeReason,
  showResumeInput,
  onResumeReasonChange,
  onShowResumeInput
}: ActionButtonsProps) {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onReschedule}
        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
      >
        <Calendar className="w-4 h-4 mr-2 inline" />
        Reagendar
      </button>

      <button
        onClick={onCancel}
        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
      >
        <XCircle className="w-4 h-4 mr-2 inline" />
        Cancelar
      </button>

      {status === 'STARTED' && onPause && (
        <button
          onClick={onPause}
          className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
        >
          <PauseCircle className="w-4 h-4 mr-2 inline" />
          Pausar
        </button>
      )}

      {status === 'ON_HOLD' ? (
        <div className="flex-1">
          {showResumeInput ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={resumeReason}
                onChange={(e) => onResumeReasonChange?.(e.target.value)}
                placeholder="Motivo para retomar"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => onResume?.()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ArrowRightCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onShowResumeInput}
              className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              <PlayCircle className="w-4 h-4 mr-2 inline" />
              Retomar
            </button>
          )}
        </div>
      ) : (
        status !== 'COMPLETED' && onProceed && (
          <button
            onClick={onProceed}
            className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
          >
            <PlayCircle className="w-4 h-4 mr-2 inline" />
            Prosseguir
          </button>
        )
      )}
    </div>
  );
}