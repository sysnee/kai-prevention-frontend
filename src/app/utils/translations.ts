export const translateStatus = (status: string): string => {
    const statusTranslations: Record<string, string> = {
        PLANNED: "PLANEJADO",
        WAITING: "AGUARDANDO",
        STARTED: "INICIADO",
        ON_HOLD: "PAUSADO",
        COMPLETED: "CONCLUÍDO",
        IN_TRANSCRIPTION: "EM TRANSCRIÇÃO",
        SIGNED: "LAUDADO",
        CANCELED: "CANCELADO",
        IN_REVISION: "EM REVISÃO",

        // Exams
        PENDING: "PENDENTE",
        DRAFT: 'Rascunho',
        PENDING_REVIEW: 'Em revisão',
        REVIEWED: 'Revisado',
    };
    return statusTranslations[status] || status;
};