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
    Badge
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

interface ServiceRequestItemProps {
    request: ServiceRequest
}

interface ExamSummaryProps {
    modality: string
    status: string
    color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
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
                    bgcolor: theme => theme.palette[color].main,
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
    const [open, setOpen] = useState(false)

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
            WAITING: 'warning',
            STARTED: 'info',
            COMPLETED: 'success',
            IN_REVISION: 'warning',
            IN_TRANSCRIPTION: 'info',
            SIGNED: 'success',
            CANCELED: 'error',
            PLANNED: 'default',
            PENDING: 'warning'
        }
        return statusMap[status] || 'default'
    }

    const getExamsSummary = () => {
        return request.exams.map(exam => ({
            modality: exam.modality,
            status: exam.status,
            color: getStatusColor(exam.status)
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={request.id}
        >
            <Box
                sx={{
                    mx: 1,
                    my: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
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
                                CPF: {request.clientCpf}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
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
                    </Stack>

                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Stack direction="row" spacing={1}>
                            {getExamsSummary().map((summary, index) => (
                                <ExamSummary key={index} {...summary} />
                            ))}
                        </Stack>
                        <IconButton
                            size="small"
                            onClick={() => setOpen(!open)}
                            sx={{
                                transition: 'transform 0.3s ease-in-out',
                                transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                                color: '#FF8046'
                            }}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Box>
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
                                        Sala
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500, color: 'text.secondary', py: 1 }}>
                                        Status
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
                                        <TableCell>{exam.room}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={translateStatus(exam.status)}
                                                color={getStatusColor(exam.status)}
                                                size="small"
                                                sx={{
                                                    minWidth: 80,
                                                    fontWeight: 500
                                                }}
                                            />
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