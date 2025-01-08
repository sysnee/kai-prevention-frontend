import { Finding, Achado, Severity } from '@/types/findings'

export function mapFindingToAchado(finding: Finding): Achado {
    return {
        id: finding.id,
        titulo: finding.pathology,
        sistema: finding.system,
        orgao: finding.organ,
        patologias: [finding.pathology],
        patologiasDetalhes: {
            [finding.pathology]: {
                descricao: finding.observations || '',
                severidade: finding.severity
            }
        },
        observacoes: finding.observations || '',
        imageId: finding.image_url,
        laudoId: finding.report.id,
        severidade: finding.severity
    }
}

export function mapAchadosToFindings(findings: Finding[]): Finding[] {
    return findings // No mapping needed since we're using Finding type directly
} 