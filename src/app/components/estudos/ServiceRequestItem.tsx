'use client'

import { ServiceRequest } from '@/app/stores/workflowStore'
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Stack,
    Divider,
    SvgIcon,
    SvgIconProps,
    Tooltip,
    Badge,
    Button
} from '@mui/material'
import { motion } from 'framer-motion'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import StarIcon from '@mui/icons-material/Star'
import ManIcon from '@mui/icons-material/Man'
import WomanIcon from '@mui/icons-material/Woman'
import PersonIcon from '@mui/icons-material/Person'
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'
import { useState } from 'react'
import { translateStatus } from '@/app/utils/translations'
import DescriptionIcon from '@mui/icons-material/Description'
import CommentIcon from '@mui/icons-material/Comment'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { maskCPF } from '@/app/utils/format'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { CheckCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/toast'
import api from '@/lib/api'

interface ServiceRequestItemProps {
    request: ServiceRequest
}

interface ExamSummaryProps {
    modality: string
    status: string
    color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
}

interface CreateReportDto {
    examId: string
    status?: string
    content?: string
}

// Instead of custom SVG icons, use Typography with Unicode symbols
function GenderSymbol({ gender }: { gender: string }) {
    return (
        <Typography
            component="span"
            sx={{
                fontSize: '18px',
                fontWeight: 900,
                color: theme =>
                    gender === 'male'
                        ? theme.palette.info.main
                        : '#FF69B4',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                textShadow: '1px 0px 1px currentColor',
                marginBottom: '4px'
            }}
        >
            {gender === 'male' ? '♂' : '♀'}
        </Typography>
    )
}

function ExamSummary({ modality, status, color }: ExamSummaryProps) {
    const getColorValue = (colorName: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning") => {
        const colorMap = {
            default: '#757575',
            primary: '#1976d2',
            secondary: '#9c27b0',
            error: '#d32f2f',
            info: '#0288d1',
            success: '#2e7d32',
            warning: '#ed6c02'
        }
        return colorMap[colorName]
    }

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: getColorValue(color),
                }}
            />
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    letterSpacing: '0.02em',
                }}
            >
                {modality}
            </Typography>
        </Box>
    )
}

function ServiceRequestItem({ request }: ServiceRequestItemProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const getStatusColor = (status: string | undefined) => {
        const statusMap: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
            DRAFT: 'info',
            PENDING_REVIEW: 'warning',
            REVIEWED: 'success',
            SIGNED: 'success',
            CANCELED: 'error',
        }
        return statusMap[status || ''] || 'default'
    }

    const getExamsSummary = () => {
        return request.exams.map(exam => ({
            modality: exam.modality,
            status: exam.report?.status || 'Sem laudo',
            color: getStatusColor(exam.report?.status)
        }))
    }

    const translateGender = (gender: string) => {
        return gender === 'male' ? 'Homem' : 'Mulher'
    }

    const calculateAge = (birthdate: string) => {
        const today = new Date()
        const birthdateDate = new Date(birthdate)
        let age = today.getFullYear() - birthdateDate.getFullYear()
        const monthDiff = today.getMonth() - birthdateDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
            age--
        }

        return `${age} anos`
    }

    const handleStartReport = async (examId: string) => {
        try {
            const dto: CreateReportDto = {
                examId
            }

            const response = await api.post('reports', dto)

            // Navigate to the new report using the returned ID
            router.push(`/dashboard/estudos/${response.id}/novo`)
        } catch (error) {
            showToast.error('Erro ao criar laudo')
            console.error('Error creating report:', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={request.id}
        >
            <Box
                onClick={() => setOpen(!open)}
                sx={{
                    mx: 1,
                    my: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 128, 70, 0.04)'
                    }
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >


                    <GenderSymbol gender={request.clientGender} />

                    <Stack spacing={0.5}>
                        <Typography
                            sx={{
                                color: 'text.primary',
                                fontWeight: 500
                            }}
                        >
                            {request.clientName}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {calculateAge(request.clientBirthdate)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                CPF: {maskCPF(request.clientCpf)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        {getExamsSummary().map((summary, index) => (
                            <ExamSummary key={index} {...summary} />
                        ))}
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ ml: 'auto' }}
                    >
                        <Tooltip title="Prescrição Médica">
                            <LocalHospitalIcon
                                fontSize="small"
                                sx={{
                                    color: '#FF8046',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                        cursor: 'pointer'
                                    }
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Questionário">
                            <AssignmentIcon
                                fontSize="small"
                                sx={{
                                    color: '#FF8046',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                        cursor: 'pointer'
                                    }
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={`6 anotações`}>
                            <Badge
                                badgeContent={6}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: '#FF9966',
                                        color: 'white'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#FF8046',
                                        transition: 'transform 0.2s ease-in-out',
                                    },
                                    '&:hover .MuiSvgIcon-root': {
                                        transform: 'scale(1.15)',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                <CommentIcon fontSize="small" />
                            </Badge>
                        </Tooltip>
                        {/* <Tooltip title="Ver no Workflow">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.location.href = `/dashboard/workflow?code=${request.code}`
                                }}
                                sx={{
                                    backgroundColor: '#FF8046',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#e5723f',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                <SyncAltIcon
                                    fontSize="small"
                                    sx={{ color: '#fff' }}
                                />
                            </IconButton>
                        </Tooltip> */}
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpen(!open)
                            }}
                            sx={{
                                transition: 'transform 0.3s ease-in-out',
                                transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                                color: '#FF8046'
                            }}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Stack>
                </Box>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 500, color: 'text.secondary', py: 1 }}>
                                        Modalidade
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500, color: 'text.secondary', py: 1 }}>
                                        Descrição
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500, color: 'text.secondary', py: 1 }}>
                                        Achados
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500, color: 'text.secondary', py: 1 }}>
                                        Situação
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500, color: 'text.secondary', py: 1 }}>
                                        Ações
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {request.exams.map((exam) => (
                                    <TableRow
                                        key={exam.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '& td': { py: 1 }
                                        }}
                                    >
                                        <TableCell>{exam.modality}</TableCell>
                                        <TableCell>{exam.description}</TableCell>
                                        <TableCell>Nenhum</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={exam.report?.status ? translateStatus(exam.report.status) : 'Sem laudo'}
                                                color={getStatusColor(exam.report?.status)}
                                                size="small"
                                                sx={{
                                                    minWidth: 80,
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={
                                                exam.report?.status === 'SIGNED' ? 'Laudo já finalizado' :
                                                    exam.report?.status === 'PENDING_REVIEW' ? 'Laudo em análise' :
                                                        exam.report?.status === 'REVIEWED' ? 'Laudo em revisão' :
                                                            exam.report?.status === 'DRAFT' ? 'Continuar laudo' :
                                                                'Iniciar laudo'
                                            }>
                                                <span>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={exam.report ? <DescriptionIcon /> : <PlayArrowIcon />}
                                                        disabled={exam.report?.status === 'SIGNED'}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (exam.report) {
                                                                // If report exists, navigate to edit page
                                                                router.push(`/dashboard/estudos/${exam.report.id}/editar`)
                                                            } else {
                                                                // If no report, create new one
                                                                handleStartReport(exam.id)
                                                            }
                                                        }}
                                                        sx={{
                                                            background: 'linear-gradient(to bottom, #FF8046, #ff7339)',
                                                            border: 'none',
                                                            '&:hover': {
                                                                background: 'linear-gradient(to bottom, #ff7339, #e5723f)',
                                                                border: 'none',
                                                            },
                                                            '&.Mui-disabled': {
                                                                background: '#ccc',
                                                                color: '#666',
                                                            },
                                                            textTransform: 'none',
                                                            fontWeight: 500,
                                                            fontSize: '0.75rem',
                                                            boxShadow: 'none',
                                                            '&:active': {
                                                                boxShadow: 'none',
                                                                border: 'none',
                                                            },
                                                            '&.MuiButton-contained': {
                                                                border: 'none',
                                                            },
                                                        }}
                                                    >
                                                        {exam.report ? 'Continuar laudo' : 'Iniciar laudo'}
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </Box>
        </motion.div>
    )
}

export default ServiceRequestItem 