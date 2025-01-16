'use client'

import { useEffect, useRef, useState } from 'react'
import { humanBodyPositions } from '@/app/constants/human-body-positions'
import Image from 'next/image'
import humanIllustration from '@/app/assets/imagens/3d-human-bg-black.webp'


interface HumanBodyMapProps {
    selectedOrgan?: string
    onOrganClick?: (organ: string) => void
}

export function HumanBodyMap({ selectedOrgan, onOrganClick }: HumanBodyMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [hoveredOrgan, setHoveredOrgan] = useState<string>()

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const updateCanvasSize = () => {
            const rect = container.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height
            drawOrgans()
        }

        const drawOrgans = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            Object.entries(humanBodyPositions).forEach(([organ, data]) => {
                const { x, y, radius } = data.position

                const pixelX = (x / 100) * canvas.width
                const pixelY = (y / 100) * canvas.height
                const pixelRadius = (radius / 100) * Math.min(canvas.width, canvas.height)

                // Draw smaller visible circle
                ctx.beginPath()
                ctx.arc(pixelX, pixelY, pixelRadius, 0, Math.PI * 2)

                if (organ === selectedOrgan) {
                    ctx.fillStyle = 'rgba(0, 150, 255, 0.8)'
                    ctx.strokeStyle = 'rgba(0, 150, 255, 1)'
                    ctx.lineWidth = 1
                } else if (organ === hoveredOrgan) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
                    ctx.lineWidth = 1
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
                    ctx.lineWidth = 0.5
                }

                ctx.fill()
                ctx.stroke()

                // Draw label if organ is selected or hovered
                if (organ === selectedOrgan || organ === hoveredOrgan) {
                    ctx.font = '12px Arial'
                    ctx.fillStyle = 'white'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'bottom'

                    const words = organ.split(' ')
                    const lineHeight = 14
                    words.forEach((word, i) => {
                        ctx.fillText(
                            word,
                            pixelX,
                            pixelY - 10 - (words.length - 1 - i) * lineHeight
                        )
                    })
                }
            })
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = (e.clientX - rect.left) / canvas.width * 100
            const y = (e.clientY - rect.top) / canvas.height * 100

            let found = false
            Object.entries(humanBodyPositions).forEach(([organ, data]) => {
                const { x: orgX, y: orgY, radius } = data.position
                const distance = Math.sqrt(Math.pow(x - orgX, 2) + Math.pow(y - orgY, 2))
                if (distance <= radius) {
                    setHoveredOrgan(organ)
                    found = true
                }
            })
            if (!found) setHoveredOrgan(undefined)
        }

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = (e.clientX - rect.left) / canvas.width * 100
            const y = (e.clientY - rect.top) / canvas.height * 100

            Object.entries(humanBodyPositions).forEach(([organ, data]) => {
                const { x: orgX, y: orgY, radius } = data.position
                const distance = Math.sqrt(Math.pow(x - orgX, 2) + Math.pow(y - orgY, 2))
                if (distance <= radius) {
                    onOrganClick?.(organ)
                }
            })
        }

        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)
        canvas.addEventListener('click', handleClick)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseleave', () => setHoveredOrgan(undefined))

        return () => {
            window.removeEventListener('resize', updateCanvasSize)
            canvas.removeEventListener('click', handleClick)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseleave', () => setHoveredOrgan(undefined))
        }
    }, [selectedOrgan, hoveredOrgan, onOrganClick])

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <Image
                src={humanIllustration}
                alt="Human body illustration"
                fill
                style={{ objectFit: 'cover' }}
                priority
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-pointer"
            />
        </div>
    )
} 