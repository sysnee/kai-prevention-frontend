export const translateStatus = (status: string): string => {
    const translations: { [key: string]: string } = {
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
    };
    return translations[status] || status;
};