import { create } from 'zustand';
import toast from 'react-hot-toast';
//import { pacsService } from '../services/pacsService';
import { WorkflowNote, WorkflowTransition } from '../types/workflow/workflow';
import { ServiceStatus } from '../types/pemissions/permissions';

export interface ServiceRequest {
  id: string;
  code: number;
  clientName: string;
  patientId: string;
  examType: string;
  priority: 'low' | 'medium' | 'high';
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
    name: string;
    room: string;
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
  setServiceRequests: (serviceRequests: any[]) => void
  addExam: (exam: ServiceRequest) => void;
  updateExam: (examId: string, data: Partial<ServiceRequest>) => void;
  moveExam: (examId: string, fromStage: string, toStage: string, reason?: string) => Promise<void>;
  addWorkflowNote: (examId: string, note: Omit<WorkflowNote, 'id' | 'createdAt'>) => void;
  cancelExam: (examId: string, reason: string) => void;
  rescheduleExam: (examId: string, newDate: Date, newTime: string, reason: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  serviceRequests: [],

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
    const exam = get().serviceRequests.find(e => e.id === examId);
    if (!exam) {
      toast.error('Exame não encontrado');
      return;
    }

    try {
      // If moving to waiting status, send to PACS
      if (toStage === 'waiting') {
        try {
          const pacsData = {
            id: exam.patientId,
            name: exam.clientName,
            birthDate: '1985-06-15', // Mock data
            gender: 'M',
            cpf: '12345678900',
            examType: exam.examType,
            accessionNumber: 'ACC001',
            referringPhysician: exam.doctor,
            modality: exam.examType.includes('Raio-X') ? 'CR' :
              exam.examType.includes('Tomografia') ? 'CT' : 'MR',
            scheduledDate: exam.date
          };

          //await pacsService.sendToWorklist(pacsData);
        } catch (error) {
          console.error('Error sending to PACS:', error);
          toast.error('Erro ao enviar para o PACS');
          return;
        }
      }

      // Add transition record
      const transition: WorkflowTransition = {
        from: fromStage,
        to: toStage,
        timestamp: new Date().toISOString(),
        userId: 'user1', // In a real app, this would be the logged-in user's ID
        reason
      };

      // Update exam status and add transition
      set((state) => ({
        serviceRequests: state.serviceRequests.map((e) =>
          e.id === examId ? {
            ...e,
            status: toStage as ServiceStatus,
            transitions: [...e.transitions, transition]
          } : e
        )
      }));

      toast.success(`Exame movido para ${toStage}`);

    } catch (error) {
      console.error('Error moving exam:', error);
      toast.error('Erro ao mover exame');
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