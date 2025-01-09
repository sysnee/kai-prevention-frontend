"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { humanBodyData } from "../constants/human-body-data"
// import BrainIcon from "@/assets/human-icons/brain.svg"
// import LungsIcon from "@/assets/human-icons/lungs.svg"
// import HeartIcon from "@/assets/human-icons/heart.svg"
// import LeafIcon from "@/assets/human-icons/leaf.svg"
// import KidneyIcon from "@/assets/human-icons/kidney.svg"
// import ReproductiveIcon from "@/assets/human-icons/reproductive.svg"
// import StomachIcon from "@/assets/human-icons/stomach.svg"
import BoneIcon from "../assets/human-icons/bone.png"
import Image from "next/image"

interface SystemFindings {
    count: number
    severity: "minor" | "moderate" | "informational" | "none"
}

interface BodySystemSelectorProps {
    findings?: Record<string, SystemFindings>
    onSystemSelect?: (system: string, subsystem?: string) => void
    selectedSystem?: string
}

const systemIcons: Record<string, React.ReactNode> = {
    // "Sistema Nervoso": <BrainIcon className="h-4 w-4" />,
    // "Sistema Respiratório": <LungsIcon className="h-4 w-4" />,
    // "Sistema Circulatório": <HeartIcon className="h-4 w-4" />,
    // "Sistema Endócrino": <LeafIcon className="h-4 w-4" />,
    // "Sistema Urinário": <KidneyIcon className="h-4 w-4" />,
    // "Sistema Reprodutivo": <ReproductiveIcon className="h-4 w-4" />,
    // "Sistema Digestivo": <StomachIcon className="h-4 w-4" />,
    // "Sistema Musculoesquelético": <Image src={BoneIcon} alt="Bone" className="h-8 w-8" />
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
            <Badge className="ml-auto bg-green-500 hover:bg-green-600">
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

    function toggleSystem(system: string) {
        setExpandedSystems(current =>
            current.includes(system)
                ? current.filter(s => s !== system)
                : [...current, system]
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
                            <button
                                onClick={() => {
                                    toggleSystem(system)
                                    onSystemSelect?.(system)
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg p-2 text-left text-sm",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isSelected && "bg-accent text-accent-foreground"
                                )}
                            >
                                <div className="flex items-center">
                                    {systemIcons[system]}
                                    <span>{system}</span>
                                </div>
                                <SystemBadge {...systemFindings} />
                            </button>

                            {isExpanded && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {Object.keys(subsystems).map(subsystem => (
                                        <button
                                            key={subsystem}
                                            onClick={() => onSystemSelect?.(system, subsystem)}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-lg p-2 text-left text-sm",
                                                "hover:bg-accent hover:text-accent-foreground",
                                                selectedSystem === `${system}/${subsystem}` &&
                                                "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            <span>{subsystem}</span>
                                            {findings[`${system}/${subsystem}`] && (
                                                <SystemBadge {...findings[`${system}/${subsystem}`]} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
} 