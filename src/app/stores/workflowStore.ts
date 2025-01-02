import { create } from 'zustand';
import toast from 'react-hot-toast';
//import { pacsService } from '../services/pacsService';
import { WorkflowNote, WorkflowTransition } from '../types/workflow/workflow';
import { ServiceStatus } from '../types/pemissions/permissions';
import api from '@/lib/api';

export const STAGE_ORDER = {
  'PLANNED': 0,
  'WAITING': 1,
  'STARTED': 2,
  'ON_HOLD': 3,
  'COMPLETED': 4,
  'IN_TRANSCRIPTION': 5,
  'IN_REVISION': 6,
  'SIGNED': 7,
  'CANCELED': 8,
  'planned': 0,
  'waiting': 1,
  'started': 2,
  'on_hold': 3,
  'completed': 4,
  'in_transcription': 5,
  'in_revision': 6,
  'signed': 7,
  'canceled': 8
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

export interface ServiceRequest {
  id: string;
  code: number;
  clientName: string;
  clientBirthdate: string;
  clientGender: string;
  clientCpf: string;
  patientId: string;
  examType: string;
  status: ServiceStatus | string;
  timeInStage: string;
  doctor: string;
  room: string;
  scheduledTime: string;
  dateTime: string;
  date: Date;
  notes?: string;
  exams: Array<{
    id: string;
    modality: string;
    description: string;
    room: string;
    status: string;
    reportId?: string;
    report: {
      id: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      createdBy: {
        id: string;
        name: string;
      }
    }
  }>;
  workflowNotes: WorkflowNote[];
  transitions: WorkflowTransition[];
  questionnaireIsPending: boolean
  cancellationReason?: string;
  canceledAt?: string;
  canceledBy?: {
    id: string;
    name: string;
  };
  medicalPrescription?: {
    doctorName: string;
    crm: string;
    phone?: string;
    fileUrl?: string;
  };
}

interface WorkflowStore {
  serviceRequests: ServiceRequest[];
  appointment: ServiceRequest | null;
  setServiceRequests: (serviceRequests: any[]) => void
  addExam: (exam: ServiceRequest) => void;
  updateExam: (examId: string, data: Partial<ServiceRequest>) => void;
  moveExam: (examId: string, fromStage: string, toStage: string, reason?: string) => Promise<void>;
  addWorkflowNote: (examId: string, note: Omit<WorkflowNote, 'id' | 'createdAt'>) => void;
  cancelExam: (examId: string, reason: string) => void;
  rescheduleExam: (examId: string, newDate: Date, newTime: string, reason: string) => void;
  setSelectedAppointment: (appointment: ServiceRequest) => void;
  clearAppointment: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  serviceRequests: [],
  appointment: null,

  setSelectedAppointment: (appointment: ServiceRequest) => {
    set({ appointment });
  },

  clearAppointment: () => {
    set({ appointment: null });
  },

  setServiceRequests: (sr) => set((state) => ({
    serviceRequests: sr
  })),

  addExam: (exam) => set((state) => ({
    serviceRequests: [...state.serviceRequests, exam]
  })),

  updateExam: (examId, data) => set((state) => ({
    serviceRequests: state.serviceRequests.map(exam =>
      exam.id === examId ? { ...exam, ...data } : exam
    )
  })),

  moveExam: async (examId, fromStage, toStage, reason) => {
    const exam = get().serviceRequests.find((e) => e.id === examId);
    if (!exam) {
      toast.error("Exame não encontrado");
      return;
    }

    try {
      const updatedTransitions = Array.isArray(exam.transitions)
        ? [...exam.transitions]
        : [];

      const transition: WorkflowTransition = {
        from: fromStage,
        to: toStage,
        timestamp: new Date().toISOString(),
        userId: exam.patientId,
        reason,
      };

      updatedTransitions.push(transition);

      const originalStatus = exam.status;
      const originalTransitions = [...updatedTransitions];

      // Atualizar o status e transições localmente
      set((state) => ({
        serviceRequests: state.serviceRequests.map((e) =>
          e.id === examId
            ? {
              ...e,
              status: toStage as ServiceStatus,
              transitions: updatedTransitions,
            }
            : e
        ),
      }));

      // Realizar requisição para a API se o destino for STARTED ou a transição for de PLANNED para WAITING
      if (toStage === "STARTED" || (fromStage === "PLANNED" && toStage === "WAITING")) {
        try {
          const endpoint = toStage === "STARTED"
            ? `service-requests/${exam.id}/status/forward/started`
            : `service-requests/${exam.id}/status/forward/waiting`;

          const response = await api.put(endpoint);

          if (!response) {
            const errorMessage = await response.text();
            throw new Error(`Erro: ${errorMessage}`);
          }

          toast.success(`Exames atualizados com sucesso`);
        } catch (apiError) {
          console.error("Erro ao atualizar:", apiError);

          // Reverter o status e as transições no caso de falha
          set((state) => ({
            serviceRequests: state.serviceRequests.map((e) =>
              e.id === examId
                ? {
                  ...e,
                  status: originalStatus,
                  transitions: originalTransitions,
                }
                : e
            ),
          }));

          toast.error(
            `Falha ao atualizar status. O exame foi revertido.`
          );
        }
      } else {
        toast.success(`Exames atualizados com sucesso`);
      }
    } catch (error) {
      console.error("Erro ao mover exame:", error);
      toast.error("Erro ao mover exame");
    }
  },

  addWorkflowNote: (examId, note) => {
    const newNote: WorkflowNote = {
      id: crypto.randomUUID(),
      text: note.text,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: note.createdBy.id,
        name: note.createdBy.name
      },
      mentions: note.mentions
    };

    set((state) => ({
      serviceRequests: state.serviceRequests.map((exam) =>
        exam.id === examId ? {
          ...exam,
          workflowNotes: [...exam.workflowNotes, newNote]
        } : exam
      )
    }));

    toast.success('Anotação adicionada com sucesso');
  },

  cancelExam: (examId, reason) => {
    const cancelInfo = {
      cancellationReason: reason,
      canceledAt: new Date().toISOString(),
      canceledBy: {
        id: 'user1',
        name: 'Dr. João Silva'
      },
      status: 'canceled'
    };

    set((state) => ({
      serviceRequests: state.serviceRequests.map((exam) =>
        exam.id === examId ? {
          ...exam,
          status: exam.status as ServiceStatus,
          ...cancelInfo,
          transitions: [...exam.transitions, {
            from: exam.status as ServiceStatus,
            to: 'CANCELED',
            timestamp: cancelInfo.canceledAt,
            userId: 'user1',
            reason: cancelInfo.cancellationReason
          }]
        } : {
          ...exam,
          status: exam.status as ServiceStatus
        }
      )
    }));

    toast.success('Exame cancelado com sucesso');
  },

  rescheduleExam: (examId, newDate, newTime, reason) => {
    set((state) => ({
      serviceRequests: state.serviceRequests.map((exam) =>
        exam.id === examId ? {
          ...exam,
          date: newDate,
          scheduledTime: newTime,
          status: 'planned',
          transitions: [...exam.transitions, {
            from: exam.status,
            to: 'planned',
            timestamp: new Date().toISOString(),
            userId: 'user1',
            reason
          }],
          workflowNotes: [...exam.workflowNotes, {
            id: crypto.randomUUID(),
            text: `Exame reagendado para ${newDate.toLocaleDateString()} às ${newTime}. Motivo: ${reason}`,
            createdAt: new Date().toISOString(),
            createdBy: {
              id: 'user1',
              name: 'Dr. João Silva'
            },
            mentions: []
          }]
        } : exam
      )
    }));

    toast.success('Exame reagendado com sucesso');
  }
}));