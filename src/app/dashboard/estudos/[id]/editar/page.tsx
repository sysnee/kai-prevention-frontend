"use client";

import { useState } from "react"
import db from "../../../../../../db.json"
import { Box, Button, Checkbox, FormControlLabel, Grid2 as Grid, Stack, Typography, Modal, Alert, CircularProgress } from "@mui/material";
import Link from "next/link";
import { Check, KeyboardArrowLeft, Close, ZoomIn } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import AchadoCard from "@/app/components/AchadoCard";
import AchadoForm from "@/app/components/AchadoForm";
import { Imagem } from "@/app/types/types"
import { Achado, Finding, Severity } from "@/types/findings"
import ImageEstudo from "@/app/components/ImageEstudo";
import Image from "next/image";
import { useParams } from 'next/navigation'
import { createFinding, getFindingsByReportId, updateFinding, deleteFinding } from '@/services/findings'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mapAchadosToFindings, mapFindingToAchado } from '@/utils/findings-mapper'
import { getReportById } from '@/services/reports'
import { Report } from '@/types/reports'
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusIcon } from "lucide-react";

export default function AchadosPage() {
    const params = useParams()
    const reportId = params.id as string
    const queryClient = useQueryClient()

    const {
        data: report,
        isLoading: isLoadingReport,
        error: reportError
    } = useQuery<Report>({
        queryKey: ['report', reportId],
        queryFn: () => getReportById(reportId)
    })

    const {
        data: findings = [],
        isLoading: isLoadingFindings,
        error: findingsError
    } = useQuery({
        queryKey: ['findings', reportId, 'recent'],
        queryFn: () => getFindingsByReportId(reportId, { limit: 3 })
    })

    const isLoading = isLoadingReport || isLoadingFindings
    const error = reportError || findingsError

    const achados = mapAchadosToFindings(findings)

    const createFindingMutation = useMutation({
        mutationFn: createFinding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['findings', reportId] })
            setIsFormVisible(false)
            setSelectedImage(null)
        }
    })

    const updateFindingMutation = useMutation({
        mutationFn: ({ id, finding }: { id: string, finding: any }) =>
            updateFinding(reportId, id, finding),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['findings', reportId] })
            setEditAchado(null)
            setIsFormVisible(false)
            setSelectedImage(null)
        }
    })

    const deleteFindingMutation = useMutation({
        mutationFn: (id: string) => deleteFinding(reportId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['findings', reportId] })
        }
    })

    const [isFormVisible, setIsFormVisible] = useState(false)
    const [editAchado, setEditAchado] = useState<Finding | null>(null);
    const [selectedImage, setSelectedImage] = useState<Imagem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleAddAchado(achado: any) {
        // Create a finding for each pathology
        const findings = achado.patologias.map(pathology => ({
            system: achado.sistema,
            organ: achado.orgao,
            pathology,
            severity: achado.patologiasDetalhes[pathology]?.severidade || Severity.NONE,
            image_url: selectedImage?.link,
            observations: `${achado.patologiasDetalhes[pathology]?.descricao || ''}\n\n${achado.observacoes || ''}`.trim(),
            report_id: reportId
        }))

        // Create all findings in parallel and wait for all to complete
        Promise.all(findings.map(finding => createFindingMutation.mutateAsync(finding)))
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ['findings', reportId] })
                setIsFormVisible(false)
                setSelectedImage(null)
            })
    }

    function handleEditAchado(updatedAchado: any) {
        if (!editAchado?.id) return

        // When editing, we only update the single finding
        updateFindingMutation.mutate({
            id: editAchado.id,
            finding: {
                system: updatedAchado.sistema,
                organ: updatedAchado.orgao,
                pathology: updatedAchado.patologias[0],
                severity: updatedAchado.patologiasDetalhes[updatedAchado.patologias[0]]?.severidade || Severity.NONE,
                image_url: selectedImage?.link,
                observations: `${updatedAchado.patologiasDetalhes[updatedAchado.patologias[0]]?.descricao || ''}\n\n${updatedAchado.observacoes || ''}`.trim()
            }
        })
    }

    function handleDeleteAchado(id: string) {
        deleteFindingMutation.mutate(id)
    }

    function handleImageSelection(imagem: Imagem, isSelected: boolean) {
        setSelectedImage(isSelected ? imagem : null);
        if (isSelected) {
            setIsFormVisible(true);
        }
    }

    function handleEdit(finding: Finding) {
        setEditAchado(finding)
        setIsFormVisible(true)
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">
                    Erro ao carregar dados: {(error as Error).message}
                </Alert>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                padding: "1.8em",
                height: "100vh",
                width: "100%"
            }}
        >
            <Stack spacing={1} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Link href={`/dashboard/estudos/${reportId}`}>
                        <Button className="bg-kai-primary hover:bg-kai-primary/70">
                            <KeyboardArrowLeft sx={(theme) => ({
                                color: theme.palette.mode === 'light' ? '#fff' : '#000'
                            })} />
                        </Button>
                    </Link>
                    <Box>
                        <Typography variant="h5">Criar achados</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {report?.exam.description} • {report?.exam.client.name}
                        </Typography>
                    </Box>
                </Box>
            </Stack>

            <Box sx={{ marginTop: "1em" }}>
                <Grid container spacing={2} marginTop={1} wrap="wrap" alignItems="flex-start">
                    <Grid
                        size={{ xs: 12, md: 7 }}
                        padding={2}
                        sx={(theme) => ({
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: theme.palette.mode === 'light' ? "#f5f6fa" : "transparent",
                            borderRadius: "5px",
                            border: theme.palette.mode === 'light' ? "none" : "1px solid hsla(220, 20%, 25%, 0.6)"
                        })}
                    >
                        <Box sx={{ width: "100%" }}>
                            <Box className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">
                                        Adicione os achados encontrados no exame.
                                    </p>
                                    <Link
                                        href={`/dashboard/estudos/${reportId}`}
                                        className="text-xs text-kai-primary hover:text-kai-primary/70"
                                    >
                                        Ver resumo do laudo →
                                    </Link>
                                </div>
                                {!isFormVisible && (
                                    <Button
                                        onClick={() => setIsFormVisible(true)}
                                        className="bg-kai-primary text-white hover:bg-kai-primary/70 flex items-center gap-2"
                                    >
                                        <AddIcon sx={{ fontSize: 18 }} />
                                        Adicionar achado
                                    </Button>
                                )}
                            </Box>


                            {isFormVisible && (
                                <Box className="mb-8 mt-4">
                                    <AchadoForm
                                        achadoToEdit={editAchado}
                                        onCancel={() => {
                                            setIsFormVisible(false)
                                            setEditAchado(null)
                                        }}
                                        onSubmit={editAchado ? handleEditAchado : handleAddAchado}
                                        selectedImage={selectedImage}
                                        isLoading={createFindingMutation.isPending || updateFindingMutation.isPending}
                                    />
                                </Box>
                            )}

                        </Box>
                        {/* <Stack spacing={2} sx={{ marginTop: "5em", width: "100%" }}>
                            <div>
                                <h2 className="text-lg font-medium text-slate-900">Últimos adicionados</h2>
                                <p className="text-sm text-slate-500">
                                    Exibindo os 3 últimos
                                </p>
                            </div>
                            {achados.length > 0 && achados.map(achado => (
                                <AchadoCard
                                    key={achado.id}
                                    achado={achado}
                                    onEdit={() => handleEdit(achado)}
                                    onDelete={() => handleDeleteAchado(achado.id)}
                                />
                            ))}
                        </Stack> */}

                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 5 }}
                        sx={(theme) => ({
                            padding: 2,
                            backgroundColor: theme.palette.mode === 'light' ? "#f5f6fa" : "transparent",
                            borderRadius: "5px",
                            border: theme.palette.mode === 'light' ? "none" : "1px solid hsla(220, 20%, 25%, 0.6)"
                        })}
                    >
                        <Stack spacing={2}>
                            <Typography
                                sx={(theme) => ({
                                    fontSize: "16px",
                                    color: theme.palette.text.primary
                                })}
                            >
                                Selecione uma <Box component="span" sx={{ color: '#FF8046' }}>imagem chave</Box> para anexar ao achado:
                            </Typography>

                            {selectedImage && (
                                <Box
                                    sx={(theme) => ({
                                        padding: 2,
                                        backgroundColor: theme.palette.mode === 'light' ? "#fff" : "transparent",
                                        borderRadius: "8px",
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        marginBottom: 2
                                    })}
                                >

                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            '&:hover .action-buttons': {
                                                opacity: 1,
                                            },
                                            marginBottom: "1em"
                                        }}
                                    >
                                        <ImageEstudo
                                            imagem={selectedImage}
                                            onSelect={handleImageSelection}
                                            width={400}
                                            height={200}
                                            isSelected={true}
                                            showCheckbox={false}
                                            onZoom={() => setIsModalOpen(true)}
                                        />
                                        <Box
                                            className="action-buttons"
                                            sx={{
                                                position: 'absolute',
                                                left: -5,
                                                right: -5,
                                                bottom: -5,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2,
                                                padding: '16px',
                                                opacity: 0,
                                                transition: 'opacity 0.2s ease-in-out',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                    filter: 'blur(8px)',
                                                    backdropFilter: 'blur(4px)',
                                                    WebkitBackdropFilter: 'blur(4px)',
                                                },
                                                '& > *': {
                                                    position: 'relative',
                                                    zIndex: 1
                                                }
                                            }}
                                        >

                                            <Button
                                                onClick={() => setIsModalOpen(true)}
                                                size="small"
                                                startIcon={<ZoomIn sx={{ color: '#FF8046' }} />}
                                                sx={{
                                                    backgroundColor: 'transparent',
                                                    color: '#FF8046',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    }
                                                }}
                                            >
                                                Zoom
                                            </Button>

                                            <Button
                                                onClick={() => setSelectedImage(null)}
                                                size="small"
                                                startIcon={<Close sx={{ color: '#FF8046' }} />}
                                                sx={{
                                                    backgroundColor: 'transparent',
                                                    color: '#FF8046',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    }
                                                }}
                                            >
                                                Remover anexo
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" sx={{ mt: 2 }}>
                                        * A imagem acima será usada como imagem chave para o achado.
                                    </Typography>
                                </Box>
                            )}

                            <Grid
                                container
                                spacing={1.5}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '12px',
                                }}
                            >
                                {db.estudos[0].imagens
                                    .filter(imagem => imagem.id !== selectedImage?.id)
                                    .map(imagem => (
                                        <Grid
                                            key={imagem.id}
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <ImageEstudo
                                                imagem={imagem}
                                                onSelect={handleImageSelection}
                                                width={150}
                                                height={150}
                                                isSelected={selectedImage?.id === imagem.id}
                                                onZoom={() => setIsModalOpen(true)}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="image-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        borderRadius: '8px',
                        outline: 'none',
                    }}
                >
                    <Image
                        src={selectedImage?.link || ''}
                        alt="Imagem ampliada"
                        width={800}
                        height={800}
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh'
                        }}
                        className="rounded-md"
                    />
                </Box>
            </Modal>

            {(createFindingMutation.isError || updateFindingMutation.isError || deleteFindingMutation.isError) && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    Erro ao processar operação: {
                        (createFindingMutation.error as Error)?.message ||
                        (updateFindingMutation.error as Error)?.message ||
                        (deleteFindingMutation.error as Error)?.message
                    }
                </Alert>
            )}
        </Box>
    )
}

function FindingsSection({ findings, onEdit, onDelete }) {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Findings</h2>
                    <p className="text-sm text-gray-500">
                        {findings.length} findings added
                    </p>
                </div>
                <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Finding
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                    {findings.map(finding => (
                        <AchadoCard
                            key={finding.id}
                            achado={finding}
                            onEdit={() => onEdit(finding)}
                            onDelete={() => onDelete(finding.id)}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}