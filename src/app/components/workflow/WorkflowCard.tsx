import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';
import { WorkflowCardModal } from './WorkflowCardModal';
import { Draggable } from '@hello-pangea/dnd';
import { useTheme } from '@mui/material';
import { useWorkflowStore } from '../../stores/workflowStore';
import { useRouter, useSearchParams } from 'next/navigation'

interface WorkflowCardProps {
  exam: any;
  index: number;
}

export function WorkflowCard({ exam, index }: WorkflowCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();

  // Verifica o status dos documentos
  const hasDocumentsPending = !exam.medicalPrescription || !exam.questionnaire || !exam.consentForm;
  const getPendingDocuments = () => {
    const pending = [];
    if (!exam.medicalPrescription) pending.push('Pedido Médico');
    if (!exam.questionnaire) pending.push('Questionário');
    if (!exam.consentForm) pending.push('Termo de Consentimento');
    return pending;
  };
  const { appointment, clearAppointment } = useWorkflowStore();

  useEffect(() => {
    // Abre o modal se o code na URL corresponder ao exam.code
    const codeParam = searchParams.get('code')
    if ((codeParam && codeParam === String(exam.code)) || (appointment?.id === exam.id)) {
      setShowModal(true)
    }
  }, [searchParams, exam.code, appointment, exam.id])

  const handleCloseModal = () => {
    setShowModal(false)
    clearAppointment()

    // Se o modal foi aberto via URL param, redireciona de volta para agendamentos
    const codeParam = searchParams.get('code')
    if (codeParam) {
      router.push('/dashboard/agendamentos')
    }
  }

  // Update the condition to hide pendencies for COMPLETED status
  const shouldShowPendencies = hasDocumentsPending && exam.status !== 'COMPLETED';

  return (
    <Draggable draggableId={exam.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3 last:mb-0 group cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <div className={"rounded-lg p-4"}
            style={{
              backgroundColor: theme.palette.background.default,
              border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
              borderLeft: shouldShowPendencies ? '4px solid #F59E0B'
                : (theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)")
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="w-8 h-8 text-gray-400" />
                <div className="ml-3">
                  <h4 className="font-medium">{exam.clientName}</h4>
                  <p className="text-sm text-gray-500">ID: {exam.code}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 rounded p-2 mb-3"
              style={{
                border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
              }}
            >
              {exam.examType}
            </div>

            {shouldShowPendencies && (
              <div className="mb-3 p-2 rounded-lg"
                style={{
                  border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
                }}
              >
                <div className="flex items-center text-amber-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-xs">Pendências:</span>
                </div>
                <div className="mt-1 text-xs text-amber-600">
                  {getPendingDocuments().join(', ')}
                </div>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {exam.dateTime}
            </div>
          </div>

          {showModal && (
            <WorkflowCardModal
              exam={exam}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}