import React, { useState } from "react";
import { Send } from "lucide-react";
import { ServiceRequestNote } from "@/app/types/workflow/workflow";
import { ServiceStatus } from "@/app/types/pemissions/permissions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotesSectionProps {
  notes: ServiceRequestNote[];
  onAddNote: (content: string) => Promise<void>;
  isLoading?: boolean;
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

export function NotesSection({
  notes = [],
  onAddNote,
  isLoading,
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState("");

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

  const renderNote = (note: ServiceRequestNote) => {
    if (!note) return null;

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
        </div>
        <p className="text-sm whitespace-pre-wrap">{note?.content || ""}</p>
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
        {Array.isArray(notes) && notes.filter(Boolean).map(renderNote)}

        {!notes?.length && (
          <p className="text-center text-gray-500 py-4">
            Nenhuma anotação encontrada
          </p>
        )}
      </div>
    </div>
  );
}
