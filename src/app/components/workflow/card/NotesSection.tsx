import React, { useState } from "react";
import { Send, Pencil, X, Check } from "lucide-react";
import { ServiceRequestNote } from "@/app/types/workflow/workflow";
import { ServiceStatus } from "@/app/types/pemissions/permissions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { notesService } from "@/app/services/notesService";
import toast from "react-hot-toast";

interface NotesSectionProps {
  notes: ServiceRequestNote[];
  onAddNote: (content: string) => Promise<void>;
  isLoading?: boolean;
  currentStatus: ServiceStatus;
}

const statusColors: Record<ServiceStatus, string> = {
  PLANNED: "bg-kai-primary text-white",
  WAITING: "bg-amber-500 text-white",
  STARTED: "bg-blue-500 text-white",
  ON_HOLD: "bg-orange-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  TRANSCRIPTION: "bg-purple-500 text-white",
  IN_REVISION: "bg-yellow-500 text-black",
  SIGNED: "bg-teal-500 text-white",
  CANCELED: "bg-red-500 text-white",
};

const statusTranslations: Record<ServiceStatus, string> = {
  PLANNED: "Planejado",
  WAITING: "Aguardando",
  STARTED: "Iniciado",
  ON_HOLD: "Pausado",
  COMPLETED: "Concluído",
  TRANSCRIPTION: "Transcrição",
  IN_REVISION: "Em Revisão",
  SIGNED: "Laudado",
  CANCELED: "Cancelado",
};

const LoadingDots = () => (
  <div className="flex items-center justify-center py-4">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-kai-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-kai-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-kai-primary rounded-full animate-bounce"></div>
    </div>
  </div>
);

export function NotesSection({
  notes = [],
  onAddNote,
  isLoading,
  currentStatus,
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await onAddNote(newNote);
      setNewNote("");
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
    }
  };

  const handleStartEdit = (note: ServiceRequestNote) => {
    if (note.createdAtStatus !== currentStatus) {
      toast.error("Só é possível editar notas criadas no status atual");
      return;
    }
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async (note: ServiceRequestNote) => {
    if (!editingContent.trim()) return;

    try {
      setIsUpdating(true);
      await notesService.update(note.id, editingContent);
      note.content = editingContent;
      setEditingNoteId(null);
      setEditingContent("");
      toast.success("Nota atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      toast.error("Erro ao atualizar nota");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderNote = (note: ServiceRequestNote) => {
    if (!note) return null;

    const isEditing = editingNoteId === note.id;
    const canEdit = note.createdAtStatus === currentStatus;

    return (
      <div key={note.id} className="p-3 rounded-lg border">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium">
              {note?.createdBy?.fullName || "Usuário"}
            </p>
            <p className="text-sm text-gray-500">
              {note?.createdAt
                ? format(
                    new Date(note.createdAt),
                    "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                    {
                      locale: ptBR,
                    }
                  )
                : "-"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {note?.createdAtStatus && (
              <span
                className={`px-2 py-1 rounded text-xs ${
                  statusColors[note.createdAtStatus as ServiceStatus] || ""
                }`}
              >
                {statusTranslations[note.createdAtStatus as ServiceStatus] ||
                  note.createdAtStatus}
              </span>
            )}
            {canEdit && !isEditing && (
              <button
                onClick={() => handleStartEdit(note)}
                className="p-1 text-gray-500 hover:text-kai-primary rounded-full transition-colors"
                title="Editar nota"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kai-primary focus:border-transparent resize-none"
              rows={3}
              disabled={isUpdating}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="p-1 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                disabled={isUpdating}
                title="Cancelar edição"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSaveEdit(note)}
                className="p-1 text-gray-500 hover:text-green-500 rounded-full transition-colors"
                disabled={isUpdating}
                title="Salvar edição"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{note?.content || ""}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Anotações</h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Digite sua anotação..."
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kai-primary focus:border-transparent resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!newNote.trim() || isLoading}
          className="p-2 bg-kai-primary text-white rounded-lg hover:bg-kai-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <LoadingDots />
        ) : (
          <>
            {Array.isArray(notes) && notes.filter(Boolean).map(renderNote)}

            {!notes?.length && (
              <p className="text-center text-gray-500 py-4">
                Nenhuma anotação encontrada
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
