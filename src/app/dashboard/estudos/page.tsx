"use client";

import { useEffect, useState } from 'react'
import { Box, Container, Typography, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { useWorkflowStore } from '@/app/stores/workflowStore'
import ServiceRequestItem from '@/app/components/estudos/ServiceRequestItem'
import api from '@/lib/api'
import { showToast } from '@/lib/toast'
import dayjs from 'dayjs'

function EstudosPage() {
    const { serviceRequests, setServiceRequests } = useWorkflowStore()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchServiceRequests() {
            try {
                // Get studies from the last 30 days
                const endDate = dayjs().format('YYYY-MM-DD')
                const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')

                const response = await api.get('service-requests', {
                    params: {
                        startDate,
                        endDate,
                        status: ['COMPLETED', 'IN_REVISION', 'IN_TRANSCRIPTION']
                    }
                })
                setServiceRequests(response.data)
            } catch (error) {
                showToast.error('Erro ao carregar lista de estudos')
                console.error('Error fetching service requests:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchServiceRequests()
    }, [setServiceRequests])

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                    Lista de Estudos
                </Typography>

                {!serviceRequests?.length ? (
                    <Typography variant="h6" color="text.secondary" align="center">
                        Nenhum estudo para laudar
                    </Typography>
                ) : (
                    <Box sx={{ mt: 4 }}>
                        {serviceRequests.map((request) => (
                            <ServiceRequestItem
                                key={request.id}
                                request={request}
                            />
                        ))}
                    </Box>
                )}
            </motion.div>
        </Container>
    )
}

export default EstudosPage
