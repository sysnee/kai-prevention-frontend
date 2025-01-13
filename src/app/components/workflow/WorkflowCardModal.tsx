import React, { useState, useEffect } from "react";
import { ServiceRequest, useWorkflowStore } from "../../stores/workflowStore";
import { RescheduleModal } from "./RescheduleModal";
import { CancelModal } from "./CancelModal";
import { MedicalPrescriptionModal } from "./MedicalPrescriptionModal";
import { TimelineSection } from "./card/TimelineSection";
import { DocumentSection } from "./card/DocumentSection";
import { ExamStatus } from "./card/ExamStatus";
import { ActionButtons } from "./card/ActionButtons";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material";
import { ServiceStatus } from "../../types/pemissions/permissions";
import { NotesSection } from "./card/NotesSection";
import { notesService } from "@/app/services/notesService";
import { ServiceRequestNote } from "@/app/types/workflow/workflow";

interface WorkflowCardModalProps {
  exam: ServiceRequest;
  onClose: () => void;
}

export function WorkflowCardModal({ exam, onClose }: WorkflowCardModalProps) {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMedicalPrescriptionModal, setShowMedicalPrescriptionModal] =
    useState(false);
  const [newNote, setNewNote] = useState("");
  const [examStatuses, setExamStatuses] = useState<
    Record<string, "PLANNED" | "STARTED" | "COMPLETED">
  >(() => {
    const initialStatuses: Record<string, "PLANNED" | "STARTED" | "COMPLETED"> =
      {};
    // exam.exams.forEach((ex: any) => {
    //   initialStatuses[ex.id] = 'PLANNED';
    // });
    return initialStatuses;
  });
  const [resumeReason, setResumeReason] = useState("");
  const [showResumeInput, setShowResumeInput] = useState(false);
  const [notes, setNotes] = useState<ServiceRequestNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const theme = useTheme();

  const { addWorkflowNote, moveExam } = useWorkflowStore();

  useEffect(() => {
    async function loadNotes() {
      setIsLoadingNotes(true);
      try {
        const notes = await notesService.findByServiceRequest(exam.id);
        setNotes(notes);
      } catch (error) {
        console.error("Erro ao carregar notas:", error);
        toast.error("Erro ao carregar notas");
      } finally {
        setIsLoadingNotes(false);
      }
    }

    loadNotes();
  }, [exam.id]);

  const handleExamStatusChange = (examId: string) => {
    setExamStatuses((prev) => {
      const currentStatus = prev[examId];
      const nextStatus =
        currentStatus === "PLANNED"
          ? "STARTED"
          : currentStatus === "STARTED"
          ? "COMPLETED"
          : "PLANNED";

      return { ...prev, [examId]: nextStatus };
    });
  };

  const handleRoomChange = (examId: string, room: string) => {
    // Implementar lógica de mudança de sala
    console.log("Mudança de sala:", examId, room);
  };

  const handleAddNote = async (content: string) => {
    try {
      const newNote = await notesService.create(exam.id, content);
      setNotes((prev) =>
        Array.isArray(prev) ? [newNote, ...prev] : [newNote]
      );
      toast.success("Nota adicionada com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
      throw error;
    }
  };

  const handleReschedule = async (date: Date, time: string, reason: string) => {
    try {
      await moveExam(exam.id, exam.status, "planned", reason);
      toast.success("Exame reagendado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao reagendar exame");
    }
  };

  const handleCancel = async (reason: string) => {
    try {
      await moveExam(exam.id, exam.status, "canceled", reason);
      toast.success("Exame cancelado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao cancelar exame");
    }
  };

  const handlePause = async () => {
    try {
      await moveExam(exam.id, exam.status, "on_hold", "Exame pausado");
      toast.success("Exame pausado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao pausar exame");
    }
  };

  const handleResume = async () => {
    if (!resumeReason.trim()) {
      toast.error("Informe o motivo para retomar o exame");
      return;
    }

    try {
      await moveExam(exam.id, exam.status, "started", resumeReason);
      toast.success("Exame retomado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao retomar exame");
    }
  };

  const handleProceed = async () => {
    const nextStage =
      exam.status === "planned"
        ? "waiting"
        : exam.status === "waiting"
        ? "started"
        : exam.status === "started"
        ? "completed"
        : null;

    if (nextStage) {
      try {
        await moveExam(exam.id, exam.status, nextStage, "Progresso automático");
        toast.success(`Exame movido para ${nextStage}`);
        onClose();
      } catch (error) {
        toast.error("Erro ao prosseguir com o exame");
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      style={{ cursor: "default" }}
    >
      <div
        className="rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6"
          style={{
            borderBottom:
              theme.palette.mode === "light"
                ? "1px solid rgba(229,231,235,255)"
                : "1px solid hsla(220, 20%, 25%, 0.6)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{exam.clientName}</h2>
              <p className="text-gray-500">ID: {exam.code}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-kai-primary hover:bg-kai-primary/10 rounded-full transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <DocumentSection
              documents={{
                prescription: Boolean(exam.medicalPrescription),
                questionnaire: Boolean(!exam.questionnaireIsPending),
                consent: Boolean(!exam.questionnaireIsPending),
              }}
              onPrescriptionClick={() => setShowMedicalPrescriptionModal(true)}
              exam={exam}
              onConsentClick={() =>
                toast(
                  "Link do termo de consentimento será implementado em breve",
                  { icon: "📄" }
                )
              }
            />

            <TimelineSection currentStage={exam.status} />

            <div
              style={{
                color: theme.palette.text.primary,
              }}
            >
              <h3 className="text-lg font-medium mb-4">Status dos Exames</h3>
              <div className="space-y-3">
                {exam.exams.map((ex: any, index: number) => (
                  <ExamStatus
                    key={index}
                    examId={ex.id}
                    description={ex.description}
                    modality={ex.modality}
                    room={ex.room}
                    status={exam.status as ServiceStatus}
                    onStatusChange={handleExamStatusChange}
                    onRoomChange={handleRoomChange}
                  />
                ))}
              </div>
            </div>

            <NotesSection
              notes={notes}
              onAddNote={handleAddNote}
              isLoading={isLoadingNotes}
              currentStatus={exam.status as ServiceStatus}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6"
          style={{
            borderTop:
              theme.palette.mode === "light"
                ? "1px solid rgba(229,231,235,255)"
                : "1px solid hsla(220, 20%, 25%, 0.6)",
          }}
        >
          <ActionButtons
            status={exam.status as ServiceStatus}
            onReschedule={() => setShowRescheduleModal(true)}
            onCancel={() => setShowCancelModal(true)}
            onPause={handlePause}
            onResume={handleResume}
            onProceed={handleProceed}
            resumeReason={resumeReason}
            showResumeInput={showResumeInput}
            onResumeReasonChange={setResumeReason}
            onShowResumeInput={() => setShowResumeInput(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showRescheduleModal && (
        <RescheduleModal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleReschedule}
        />
      )}

      {showCancelModal && (
        <CancelModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
        />
      )}

      {showMedicalPrescriptionModal && (
        <MedicalPrescriptionModal
          isOpen={showMedicalPrescriptionModal}
          onClose={() => setShowMedicalPrescriptionModal(false)}
          onSave={(data) => {
            console.log("Medical prescription data:", data);
            setShowMedicalPrescriptionModal(false);
            toast.success("Pedido médico salvo com sucesso");
          }}
        />
      )}
    </div>
  );
}
