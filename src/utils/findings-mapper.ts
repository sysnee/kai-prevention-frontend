import { Finding, Achado } from '@/types/findings'

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
                severidade: 'nenhuma'
            }
        },
        observacoes: finding.observations || '',
        imageId: finding.image_url,
        laudoId: finding.report.id
    }
}

export function mapAchadosToFindings(findings: Finding[]): Finding[] {
    return findings // No mapping needed since we're using Finding type directly
} 