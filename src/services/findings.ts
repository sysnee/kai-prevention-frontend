import api from '@/lib/api'
import { Severity } from '@/types/findings'

export interface CreateFindingDto {
    system: string
    organ: string
    pathology: string
    severity: Severity
    image_url?: string
    observations?: string
    report_id: string
}

export async function createFinding(finding: CreateFindingDto) {
    return api.post(`/reports/${finding.report_id}/findings`, finding)
}

export async function updateFinding(reportId: string, id: string, finding: Partial<CreateFindingDto>) {
    return api.patch(`/reports/${reportId}/findings/${id}`, finding)
}

export async function deleteFinding(reportId: string, id: string) {
    return api.delete(`/reports/${reportId}/findings/${id}`)
}

export async function getFindingsByReportId(reportId: string, options?: { limit?: number }) {
    const params = new URLSearchParams()
    if (options?.limit) {
        params.append('limit', options.limit.toString())
    }

    const queryString = params.toString()
    const url = `/reports/${reportId}/findings${queryString ? `?${queryString}` : ''}`

    return api.get(url)
} 