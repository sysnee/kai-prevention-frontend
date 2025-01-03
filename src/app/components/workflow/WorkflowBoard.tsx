import React, { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { WorkflowColumn } from './WorkflowColumn';
import { WorkflowCard } from './WorkflowCard';
import { STAGE_ORDER, useWorkflowStore } from '../../stores/workflowStore';
import {
  ClipboardList,
  Clock,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  FileCheck,
  XCircle,
  AlertOctagon,
  ClockIcon,
  AlertCircle
} from 'lucide-react';
import { WorkflowConfirmationDialog } from './dialogs/WorkflowConfirmationDialog'
import toast from 'react-hot-toast'

export const WORKFLOW_STAGES = [
  {
    id: 'PLANNED',
    title: 'Planejado',
    icon: ClipboardList,
    color: 'text-kai-primary',
    description: 'Exames agendados'
  },
  {
    id: 'WAITING',
    title: 'Aguardando',
    icon: Clock,
    color: 'text-amber-500',
    description: 'Pacientes em espera'
  },
  {
    id: 'STARTED',
    title: 'Iniciado',
    icon: PlayCircle,
    color: 'text-blue-500',
    description: 'Em execução'
  },
  {
    id: 'ON_HOLD',
    title: 'Pausado',
    icon: PauseCircle,
    color: 'text-orange-500',
    description: 'Temporariamente pausado'
  },
  {
    id: 'COMPLETED',
    title: 'Concluído',
    icon: CheckCircle2,
    color: 'text-green-500',
    description: 'Exames finalizados'
  },
  {
    id: 'IN_TRANSCRIPTION',
    title: 'Transcrição',
    icon: FileText,
    color: 'text-purple-500',
    description: 'Em transcrição'
  },
  {
    id: 'IN_REVISION',
    title: 'Em Revisão',
    icon: ClockIcon,
    color: 'text-yellow-500',
    description: 'Exames em revisão'
  },
  {
    id: 'RELEVANT_FINDINGS',
    title: 'Achados Relevantes',
    icon: AlertCircle,
    color: 'text-rose-500',
    description: 'Exames com achados importantes'
  },
  {
    id: 'SIGNED',
    title: 'Laudado',
    icon: FileCheck,
    color: 'text-teal-500',
    description: 'Laudos finalizados'
  },
  {
    id: 'CANCELED',
    title: 'Cancelados',
    icon: XCircle,
    color: 'text-red-500',
    description: 'Exames cancelados'
  }
];

interface WorkflowBoardProps {
  planned: any[];
  waiting: any[];
  started: any[];
  on_hold: any[];
  completed: any[];
  transcription: any[];
  signed: any[];
  canceled: any[];
  in_revision: any[];
  searchQuery: string;
  selectedStatus: string | null;
  selectedDate: Date;
  relevant_findings: any[];
}

export function WorkflowBoard({
  planned,
  waiting,
  started,
  on_hold,
  completed,
  transcription,
  signed,
  canceled,
  in_revision,
  searchQuery,
  selectedStatus,
  selectedDate,
  relevant_findings = []
}: WorkflowBoardProps) {
  const { serviceRequests, moveExam, setServiceRequests } = useWorkflowStore();
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean
    examId: string
    source: string
    destination: string
  }>({
    isOpen: false,
    examId: '',
    source: '',
    destination: ''
  })
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    setServiceRequests(
      [].concat(
        planned,
        waiting,
        started,
        on_hold,
        completed,
        transcription,
        signed,
        canceled,
        in_revision
      )
    )
  }, [
    planned,
    waiting,
    started,
    in_revision
  ])

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // If not changing columns, do nothing
    if (source.droppableId === destination.droppableId) return

    // Check if trying to move backwards
    if (STAGE_ORDER[destination.droppableId.toUpperCase()] < STAGE_ORDER[source.droppableId.toUpperCase()]) {
      toast.error('Não é permitido mover exames para estágios anteriores', {
        duration: 5000,
      })
      return
    }

    // Show confirmation dialog for forward movement
    setConfirmationDialog({
      isOpen: true,
      examId: draggableId,
      source: source.droppableId,
      destination: destination.droppableId
    })
  }

  const handleConfirmMove = async () => {
    const { examId, source, destination } = confirmationDialog

    setIsMoving(true)
    try {
      await moveExam(examId, source, destination)
      setConfirmationDialog(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      console.error('Error moving exam:', error)
      toast.error('Erro ao mover o exame')
    } finally {
      setIsMoving(false)
    }
  }

  // const filteredExams = serviceRequests?.filter(sr => {
  //   // const matchesSearch = exam.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   //   exam.examType.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesStatus = !selectedStatus || sr.status === selectedStatus;
  //   // const matchesDate = selectedDate.toDateString() === new Date(exam.date).toDateString();
  //   return matchesStatus;
  // }) || [];

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="inline-flex gap-4 lg:gap-6 min-w-full py-4">
        {/* <pre>
          {JSON.stringify(serviceRequests, null, 2)}
        </pre> */}
        <WorkflowConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirmMove}
          title="Confirmar movimentação"
          description="Esta ação é irreversível. Deseja prosseguir com a movimentação do exame?"
          confirmText="Sim, mover"
          cancelText="Cancelar"
          isLoading={isMoving}
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          {WORKFLOW_STAGES.map((status) => (
            <div
              key={status.id}
              className="w-[280px] md:w-[320px] lg:w-80 flex-shrink-0"
            >
              <Droppable droppableId={status.id}>
                {(provided, _) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="max-h-100"
                  >
                    <WorkflowColumn
                      title={status.title}
                      icon={status.icon}
                      color={status.color}
                      description={status.description}
                      count={serviceRequests.filter(sr => sr.status === status.id).length}
                    >
                      {serviceRequests
                        .filter(exam => exam.status === status.id)
                        .map((exam, index) => (
                          <WorkflowCard
                            key={exam.id}
                            exam={exam}
                            index={index}
                          />
                        ))}
                      {provided.placeholder}
                    </WorkflowColumn>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}