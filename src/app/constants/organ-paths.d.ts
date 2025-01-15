export interface OrganPath {
    left?: string
    right?: string
}

export const organPaths: Record<string, string | OrganPath> 