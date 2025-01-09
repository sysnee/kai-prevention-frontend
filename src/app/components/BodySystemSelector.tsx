"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { humanBodyData } from "../constants/human-body-data"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Severity } from "@/types/findings"

interface BodySystemSelectorProps {
    findings?: Record<string, { count: number; severity: Severity }>
    onSystemSelect?: (system: string, subsystem?: string, pathology?: string) => void
    selectedSystem?: string
}

function getSeverityColor(severity: Severity) {
    switch (severity) {
        case Severity.LOW:
            return "bg-yellow-300 hover:bg-yellow-400"
        case Severity.MEDIUM:
            return "bg-amber-500 hover:bg-amber-600"
        case Severity.HIGH:
            return "bg-rose-500 hover:bg-rose-600"
        case Severity.SEVERE:
            return "bg-black hover:bg-black/90"
        case Severity.NONE:
            return "bg-blue-300 hover:bg-blue-400"
        default:
            return "bg-gray-500 hover:bg-gray-600"
    }
}

function SystemBadge({ count, severity }: { count: number, severity: Severity }) {
    if (count === 0) {
        return (
            <Badge className="ml-auto bg-green-500 text-white hover:bg-green-600">
                Normal
            </Badge>
        )
    }

    return (
        <Badge className={cn("ml-auto text-white", getSeverityColor(severity))}>
            {count} {count === 1 ? 'achado' : 'achados'}
        </Badge>
    )
}

export function BodySystemSelector({
    findings = {},
    onSystemSelect,
    selectedSystem
}: BodySystemSelectorProps) {
    const [expandedSystem, setExpandedSystem] = useState<string>()
    const [expandedOrgan, setExpandedOrgan] = useState<string>()

    function toggleSystem(system: string) {
        setExpandedSystem(current => current === system ? undefined : system)
        setExpandedOrgan(undefined)
    }

    function toggleOrgan(organ: string) {
        setExpandedOrgan(current => current === organ ? undefined : organ)
    }

    return (
        <>
            {/* <pre>
                {JSON.stringify(findings, null, 2)}
            </pre> */}
            <ScrollArea className="h-[calc(100vh-100px)] w-full rounded-md border">
                <div className="p-4">
                    {Object.entries(humanBodyData).map(([system, organs]) => {
                        const systemData = findings[system]
                        const isExpanded = expandedSystem === system
                        const isSelected = selectedSystem === system

                        const systemSeverity = systemData?.severity || Severity.NONE

                        return (
                            <div key={system} className="mb-4">
                                <div className="flex w-full items-center">
                                    <button
                                        onClick={() => toggleSystem(system)}
                                        className="p-2 hover:bg-accent rounded-l-lg"
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => onSystemSelect?.(system)}
                                        className={cn(
                                            "flex flex-1 text-left items-center justify-between rounded-r-lg p-2 text-sm",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            isSelected && "bg-accent text-accent-foreground"
                                        )}
                                    >
                                        <span>{system}</span>
                                        <SystemBadge
                                            count={systemData?.count || 0}
                                            severity={systemSeverity}
                                        />
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="ml-4 space-y-1">
                                        {Object.entries(organs).map(([organ, pathologies]) => {
                                            const organFindings = findings[`${system}/${organ}`]
                                            const isOrganExpanded = expandedOrgan === organ
                                            const isOrganSelected = selectedSystem === `${system}/${organ}`

                                            return (
                                                <div key={organ} className="mt-1">
                                                    <div className="flex w-full items-center">
                                                        <button
                                                            onClick={() => toggleOrgan(organ)}
                                                            className="p-2 hover:bg-accent rounded-l-lg"
                                                        >
                                                            {isOrganExpanded ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => onSystemSelect?.(system, organ)}
                                                            className={cn(
                                                                "flex flex-1 items-center justify-between rounded-r-lg p-2 text-sm",
                                                                "hover:bg-accent hover:text-accent-foreground",
                                                                isOrganSelected && "bg-accent text-accent-foreground"
                                                            )}
                                                        >
                                                            <span>{organ}</span>
                                                            <SystemBadge
                                                                count={organFindings?.count || 0}
                                                                severity={organFindings?.severity || Severity.NONE}
                                                            />
                                                        </button>
                                                    </div>

                                                    {isOrganExpanded && (
                                                        <div className="ml-10 space-y-1 py-1">
                                                            {pathologies.map((pathology: string) => {
                                                                const pathologyKey = `${system}/${organ}/${pathology}`
                                                                const pathologyFindings = findings[pathologyKey]
                                                                const isPathologySelected = selectedSystem === `${system}/${organ}/${pathology}`

                                                                return (
                                                                    <button
                                                                        key={pathology}
                                                                        onClick={() => onSystemSelect?.(system, organ, pathology)}
                                                                        className={cn(
                                                                            "w-full rounded-lg p-2 text-left text-sm",
                                                                            "hover:bg-accent hover:text-accent-foreground",
                                                                            isPathologySelected && "bg-accent text-accent-foreground"
                                                                        )}
                                                                    >
                                                                        <div className="flex justify-between items-center">
                                                                            <span>{pathology}</span>
                                                                            {pathologyFindings && (
                                                                                <SystemBadge
                                                                                    count={pathologyFindings.count}
                                                                                    severity={pathologyFindings.severity}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </>
    )
} 