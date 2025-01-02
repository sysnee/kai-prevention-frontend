'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTheme } from '@mui/material/styles'
import { Button, Typography, CircularProgress } from '@mui/material'

interface WorkflowConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
}

export function WorkflowConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false
}: WorkflowConfirmationDialogProps) {
    const theme = useTheme()

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div
                className="rounded-lg p-6 max-w-md w-full mx-4"
                style={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-kai-primary/10 rounded-full p-3">
                        <AlertTriangle className="w-6 h-6 text-kai-primary" />
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-center mb-2">
                    {title}
                </h3>

                <p className="text-center text-gray-500 mb-6">
                    {description}
                </p>

                <div className="flex justify-end space-x-3">
                    <Button
                        disabled={isLoading}
                        sx={(theme) => ({
                            backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
                            border: "1px solid #e5e7eb"
                        })}
                        className="text-kai-primary transition-colors hover:bg-kai-primary/10"
                        onClick={onClose}
                    >
                        <Typography>{cancelText}</Typography>
                    </Button>
                    <Button
                        disabled={isLoading}
                        className="bg-kai-primary hover:bg-kai-primary/70"
                        onClick={onConfirm}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <Typography sx={(theme) => ({
                                color: theme.palette.mode === 'light' ? '#fff' : '#000'
                            })}>
                                {confirmText}
                            </Typography>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
} 