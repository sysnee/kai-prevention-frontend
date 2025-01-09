"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { humanBodyData } from "../constants/human-body-data"
import { ChevronDown, ChevronRight } from "lucide-react"
import BoneIcon from "../assets/human-icons/bone.png"
import Image from "next/image"

interface SystemFindings {
    count: number
    severity: "minor" | "moderate" | "informational" | "none"
}

interface BodySystemSelectorProps {
    findings?: Record<string, SystemFindings>
    onSystemSelect?: (system: string, subsystem?: string, pathology?: string) => void
    selectedSystem?: string
}

const systemIcons: Record<string, React.ReactNode> = {
    "Sistema Musculoesquelético": <Image src={BoneIcon} alt="Bone" className="h-4 w-4" />
}

function getSeverityColor(severity: SystemFindings["severity"]) {
    switch (severity) {
        case "minor":
            return "bg-yellow-500 hover:bg-yellow-600"
        case "moderate":
            return "bg-orange-500 hover:bg-orange-600"
        case "informational":
            return "bg-blue-500 hover:bg-blue-600"
        case "none":
            return "bg-green-500 hover:bg-green-600"
        default:
            return "bg-gray-500 hover:bg-gray-600"
    }
}

function SystemBadge({ count, severity }: SystemFindings) {
    if (count === 0) {
        return (
            <Badge className="ml-auto bg-green-500 text-white hover:bg-green-600">
                Normal
            </Badge>
        )
    }

    const severityText = {
        minor: "minor",
        moderate: "moderate",
        informational: "informational"
    }[severity]

    return (
        <Badge className={cn("ml-auto", getSeverityColor(severity))}>
            {count} {severityText} {count === 1 ? "finding" : "findings"}
        </Badge>
    )
}

export function BodySystemSelector({
    findings = {},
    onSystemSelect,
    selectedSystem
}: BodySystemSelectorProps) {
    const [expandedSystems, setExpandedSystems] = useState<string[]>(["Sistema Musculoesquelético"])
    const [expandedOrgans, setExpandedOrgans] = useState<string[]>([])

    function toggleSystem(system: string) {
        setExpandedSystems(current =>
            current.includes(system)
                ? current.filter(s => s !== system)
                : [...current, system]
        )
    }

    function toggleOrgan(organ: string) {
        setExpandedOrgans(current =>
            current.includes(organ)
                ? current.filter(o => o !== organ)
                : [...current, organ]
        )
    }

    return (
        <ScrollArea className="h-[calc(100vh-100px)] w-full rounded-md border">
            <div className="p-4">
                {Object.entries(humanBodyData).map(([system, subsystems]) => {
                    const systemFindings = findings[system] || { count: 0, severity: "none" }
                    const isExpanded = expandedSystems.includes(system)
                    const isSelected = selectedSystem === system

                    return (
                        <div key={system} className="mb-4">
                            <div className="flex w-full items-center">
                                <button
                                    onClick={() => toggleSystem(system)}
                                    className="p-2 hover:bg-accent rounded-l-lg"
                                    aria-label={isExpanded ? "Collapse system" : "Expand system"}
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
                                        "flex flex-1 items-center justify-between rounded-r-lg p-2 text-left text-sm",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        isSelected && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {systemIcons[system]}
                                        <span>{system}</span>
                                    </div>
                                    <SystemBadge {...systemFindings} />
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="ml-4 space-y-1">
                                    {Object.entries(subsystems).map(([organ, pathologies]) => {
                                        const isOrganExpanded = expandedOrgans.includes(organ)
                                        const organFindings = findings[`${system}/${organ}`]
                                        const isOrganSelected = selectedSystem === `${system}/${organ}`

                                        return (
                                            <div key={organ} className="mt-1">
                                                <div className="flex w-full items-center">
                                                    <button
                                                        onClick={() => toggleOrgan(organ)}
                                                        className="p-2 hover:bg-accent rounded-l-lg"
                                                        aria-label={isOrganExpanded ? "Collapse organ" : "Expand organ"}
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
                                                            "flex flex-1 items-center justify-between rounded-r-lg p-2 text-left text-sm",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                            isOrganSelected && "bg-accent text-accent-foreground"
                                                        )}
                                                    >
                                                        <span>{organ}</span>
                                                        {organFindings && <SystemBadge {...organFindings} />}
                                                    </button>
                                                </div>

                                                {isOrganExpanded && (
                                                    <div className="ml-10 space-y-1 py-1">
                                                        {pathologies.map((pathology: string) => {
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
                                                                    {pathology}
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
    )
} 