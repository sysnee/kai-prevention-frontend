export interface Position {
    x: number // percentage from left (0-100)
    y: number // percentage from top (0-100)
    radius?: number // click radius in pixels
}

export interface BodyPart {
    position: Position
    conditions: string[]
}

export interface OrganSystem {
    organs: Record<string, BodyPart>
    conditions?: string[] // System-level conditions
}