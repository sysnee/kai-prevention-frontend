import api from '@/lib/api'

interface CreateFindingDto {
    system: string
    organ: string
    pathology: string
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

export async function getFindingsByReportId(reportId: string) {
    return api.get(`/reports/${reportId}/findings`)
} 