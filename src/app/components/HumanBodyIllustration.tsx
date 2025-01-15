"use client"

import { useState } from 'react'
import { Position, HumanBodyData } from '../constants/types'
import { organPaths } from '../constants/organ-paths'

interface HumanBodyIllustrationProps {
    data: HumanBodyData
    onSelectOrgan?: (system: string, organ: string) => void
    selectedSystem?: string
    selectedOrgan?: string
}

export function HumanBodyIllustration({
    data,
    onSelectOrgan,
    selectedSystem,
    selectedOrgan
}: HumanBodyIllustrationProps) {
    const [hoveredPoint, setHoveredPoint] = useState<{ system: string, organ: string } | null>(null)

    function renderOrgan(systemName: string, organName: string, organ: any) {
        const organPath = organPaths[organName]
        if (!organPath) return null

        const commonProps = {
            onClick: () => onSelectOrgan?.(systemName, organName),
            onMouseEnter: () => setHoveredPoint({ system: systemName, organ: organName }),
            onMouseLeave: () => setHoveredPoint(null),
            className: `
                transition-all duration-200 cursor-pointer
                ${selectedSystem === systemName && selectedOrgan === organName
                    ? 'fill-primary stroke-primary-foreground'
                    : 'fill-muted stroke-muted-foreground hover:fill-muted-foreground'
                }
                ${hoveredPoint?.system === systemName && hoveredPoint?.organ === organName
                    ? 'opacity-80 scale-105'
                    : 'opacity-50'
                }
            `
        }

        // Handle special case for organs with left/right parts
        if (typeof organPath === 'object' && 'left' in organPath) {
            return (
                <g
                    key={`${systemName}-${organName}`}
                    transform={`translate(${organ.position.x} ${organ.position.y})`}
                    {...commonProps}
                >
                    <path d={organPath.left} />
                    <path d={organPath.right} />
                    <text
                        x="0"
                        y="-25"
                        className="text-xs fill-current pointer-events-none"
                        textAnchor="middle"
                    >
                        {organName}
                    </text>
                </g>
            )
        }

        return (
            <g
                key={`${systemName}-${organName}`}
                transform={`translate(${organ.position.x} ${organ.position.y})`}
                {...commonProps}
            >
                <path d={organPath as string} />
                <text
                    x="0"
                    y="-5"
                    className="text-xs fill-current pointer-events-none"
                    textAnchor="middle"
                >
                    {organName}
                </text>
            </g>
        )
    }

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[1/2]">
            <svg
                viewBox="0 0 100 200"
                className="w-full h-full"
            >
                {/* Body outline */}
                <path
                    d={`
                        M 50 10
                        C 65 10, 75 20, 75 35
                        C 75 50, 70 65, 70 80
                        L 65 120
                        L 60 180
                        L 55 200
                        L 45 200
                        L 40 180
                        L 35 120
                        L 30 80
                        C 30 65, 25 50, 25 35
                        C 25 20, 35 10, 50 10
                        Z
                    `}
                    className="fill-background stroke-border"
                />

                {/* Render organs */}
                {Object.entries(data.systems).map(([systemName, system]) =>
                    Object.entries(system.organs).map(([organName, organ]) =>
                        renderOrgan(systemName, organName, organ)
                    )
                )}
            </svg>

            {/* Tooltip */}
            {hoveredPoint && (
                <div
                    className="absolute bg-popover text-popover-foreground p-2 rounded-md shadow-md text-sm"
                    style={{
                        left: `${data.systems[hoveredPoint.system].organs[hoveredPoint.organ].position.x}%`,
                        top: `${data.systems[hoveredPoint.system].organs[hoveredPoint.organ].position.y}%`,
                        transform: 'translate(-50%, -120%)'
                    }}
                >
                    <p className="font-medium">{hoveredPoint.organ}</p>
                    <p className="text-xs text-muted-foreground">{hoveredPoint.system}</p>
                </div>
            )}
        </div>
    )
} 