export enum Severity {
    NONE = 'none',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    SEVERE = 'severe',
}

interface User {
    id: string
    fullName: string
    email: string
}

interface Report {
    id: string
    status: string
    content: string | null
    createdAt: string
    updatedAt: string
}

export interface Finding {
    id: string
    system: string
    organ: string
    pathology: string
    severity: Severity
    image_url?: string
    observations?: string
    created_at: string
    updated_at: string
    created_by: User
    report: Report
}

export interface Achado {
    id: string
    titulo: string
    sistema: string
    orgao: string
    patologias: string[]
    patologiasDetalhes: Record<string, {
        descricao: string
        severidade: Severity
    }>
    observacoes: string
    imageId?: string
    imagemId?: string
    severidade?: Severity
    laudoId: string
} 