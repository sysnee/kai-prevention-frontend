import { Finding } from './findings'

export enum ReportStatus {
    DRAFT = 'DRAFT',
    PENDING_REVIEW = 'PENDING_REVIEW',
    REVIEWED = 'REVIEWED',
    APPROVED = 'APPROVED',
    PUBLISHED = 'PUBLISHED'
}

export interface ServiceRequestExam {
    id: string
    // Add other exam fields as needed
}

export interface Report {
    id: string
    status: ReportStatus
    content: string | null
    exam: {
        status: string
        modality: string
        description: string
        serviceRequestId: string
        client: {
            name: string
        }
    }
    createdAt?: Date
    updatedAt?: Date
}