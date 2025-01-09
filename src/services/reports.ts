import api from '@/lib/api'
import { Report } from '../types/reports'

export async function getReportById(id: string): Promise<Report> {
    try {
        const report = await api.get(`/reports/${id}`)
        return report
    } catch (error: any) {
        throw new Error(`Failed to fetch report: ${error.message}`)
    }
}