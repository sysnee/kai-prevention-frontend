"use client";

import { Box, Button, Grid2 as Grid, Stack, CircularProgress, Alert } from "@mui/material"
import { KeyboardArrowLeft } from "@mui/icons-material"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@mui/material"
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getFindingsByReportId } from '@/services/findings'
import { getReportById } from '@/services/reports'
import { Report } from '@/types/reports'
import AchadoCard from "@/app/components/AchadoCard"
import AddIcon from '@mui/icons-material/Add'

export default function EstudoResumoPage() {
    const theme = useTheme()
    const params = useParams()
    const reportId = params.id as string

    // Fetch report data
    const {
        data: report,
        isLoading: isLoadingReport,
        error: reportError
    } = useQuery<Report>({
        queryKey: ['report', reportId],
        queryFn: () => getReportById(reportId)
    })

    // Fetch findings data
    const {
        data: findings = [],
        isLoading: isLoadingFindings,
        error: findingsError
    } = useQuery({
        queryKey: ['findings', reportId],
        queryFn: () => getFindingsByReportId(reportId)
    })

    const isLoading = isLoadingReport || isLoadingFindings
    const error = reportError || findingsError

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
        <Box sx={{ padding: "1.8em", height: "100vh" }}>
            <Stack spacing={1} sx={{ mb: 4 }}>
                {/* Header with back button and title */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1.5em" }}>
                        <Link href={`/`}>
                            <Button className="bg-kai-primary hover:bg-kai-primary/70">
                                <KeyboardArrowLeft sx={(theme) => ({
                                    color: theme.palette.mode === 'light' ? '#fff' : '#000'
                                })} />
                            </Button>
                        </Link>

                        <Stack>
                            <Box component="h2" sx={(theme) => ({
                                fontSize: '24px',
                                color: theme.palette.text.primary,
                                marginBottom: '4px'
                            })}>
                                Resumo
                            </Box>
                            <Box component="p" sx={(theme) => ({
                                fontSize: '14px',
                                color: theme.palette.text.secondary,
                            })}>
                                {report?.exam.description} • {report?.exam.client.name}
                            </Box>
                        </Stack>
                    </Box>

                    {/* Edit button */}
                    <Link href={`/dashboard/estudos/${reportId}/editar`}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            sx={(theme) => ({
                                borderColor: theme.palette.mode === 'light' ? '#e5e7eb' : '#333b4d',
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: theme.palette.mode === 'light' ? '#d1d5db' : '#4b5563',
                                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'
                                }
                            })}
                        >
                            Adicionar achados
                        </Button>
                    </Link>
                </Box>
            </Stack>

            <Box sx={{ marginTop: "3em" }}>
                <Grid container spacing={1.5} justifyContent="start" marginTop={1} wrap="wrap">
                    <Grid size={8}>
                        <Stack spacing={3}>
                            {findings.map((finding) => (
                                <Stack key={finding.id} spacing={3} direction={'row'}>
                                    <Box width={'100%'}>
                                        <Box sx={(theme) => ({
                                            backgroundColor: theme.palette.mode === 'light' ? "#fff" : "transparent",
                                            border: theme.palette.mode === 'light' ? "none" : "1px solid #333b4d",
                                            padding: "2em",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "1em",
                                            borderRadius: "10px",
                                            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                                            height: finding.image_url ? '225px' : 'auto',
                                        })}>
                                            <Stack width={finding.image_url ? '70%' : '100%'}>
                                                <Box component="h1" sx={(theme) => ({
                                                    color: theme.palette.text.primary,
                                                    fontWeight: "bold",
                                                    fontSize: "22px"
                                                })}>
                                                    {finding.pathology}
                                                </Box>
                                                <Grid container marginY={1} spacing={4}>
                                                    <Grid size={3}>
                                                        <Stack>
                                                            <Box component="h1" sx={(theme) => ({
                                                                color: theme.palette.text.primary,
                                                                fontWeight: "bold",
                                                                fontSize: "14px"
                                                            })}>
                                                                Sistema
                                                            </Box>
                                                            <Box component="h1" sx={(theme) => ({
                                                                color: theme.palette.text.primary,
                                                                fontSize: "14px"
                                                            })}>
                                                                {finding.system}
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid size={3}>
                                                        <Stack>
                                                            <Box component="h1" sx={(theme) => ({
                                                                color: theme.palette.text.primary,
                                                                fontWeight: "bold",
                                                                fontSize: "14px"
                                                            })}>
                                                                Orgão
                                                            </Box>
                                                            <Box component="h1" sx={(theme) => ({
                                                                color: theme.palette.text.primary,
                                                                fontSize: "14px"
                                                            })}>
                                                                {finding.organ}
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid size={5}>
                                                        <Stack>
                                                            <Box component="h1" sx={(theme) => ({
                                                                color: theme.palette.text.primary,
                                                                fontWeight: "bold",
                                                                fontSize: "14px"
                                                            })}>
                                                                Observações
                                                            </Box>
                                                            <Box component="h1" sx={(theme) => ({
                                                                color: theme.palette.text.primary,
                                                                fontSize: "14px"
                                                            })}>
                                                                {finding.observations}
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Stack>

                                            {finding.image_url && (
                                                <Box sx={{
                                                    width: '250px',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <Image
                                                        src={finding.image_url}
                                                        alt="imagem-achado"
                                                        width={250}
                                                        height={250}
                                                        className="rounded-lg cursor-pointer border object-cover"
                                                        style={{
                                                            maxHeight: '180px',
                                                            width: '100%'
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Right side panel */}
                    <Grid size={4}>
                        <Box sx={(theme) => ({
                            width: '100%',
                            backgroundColor: theme.palette.mode === 'light' ? "#fff" : "transparent",
                            border: theme.palette.mode === 'light' ? "1px solid #dadee7" : "1px solid #333b4d",
                            borderRadius: '20px',
                            padding: 3
                        })}>
                            <Box
                                component="h2"
                                sx={(theme) => ({
                                    color: theme.palette.text.primary,
                                    fontWeight: "bold",
                                    fontSize: "24px"
                                })}
                            >
                                Resumo do laudo
                            </Box>
                            <Box
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.mode === 'light' ? "#f5f6fa" : "#0c1017",
                                    borderRadius: '5px',
                                    padding: 1,
                                    marginY: 2
                                })}
                            >
                                <Box
                                    component="p"
                                    sx={(theme) => ({
                                        color: theme.palette.text.primary
                                    })}
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                                    molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                                    numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                                    optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
                                    obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                                    nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
                                    tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                                    quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos
                                    sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
                                    recusandae alias error harum maxime adipisci amet laborum. Perspiciatis
                                    minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit
                                    quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur
                                    fugiat, temporibus enim commodi iusto libero magni deleniti quod quam
                                    consequuntur! Commodi minima excepturi repudiandae velit hic maxime
                                    doloremque. Quaerat provident commodi consectetur veniam similique ad
                                    earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo
                                    fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore
                                    suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium
                                    modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam
                                    totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniam
                                    quasi aliquam eligendi, placeat qui corporis. lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                                    molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                                    numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                                    optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
                                    obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                                    nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
                                    tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                                    quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos
                                    sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
                                    recusandae alias error harum maxime adipisci amet laborum. Perspiciatis
                                    minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit
                                    quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur
                                    fugiat, temporibus enim commodi iusto libero magni deleniti quod quam
                                    consequuntur! Commodi minima excepturi repudiandae velit hic maxime
                                    doloremque. Quaerat provident commodi consectetur veniam similique ad
                                    earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo
                                    fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore
                                    suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium
                                    modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam
                                    totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniam
                                    quasi aliquam eligendi, placeat qui corporis!
                                </Box>
                            </Box>
                            <Button
                                sx={(theme) => ({
                                    width: "100%",
                                    fontSize: "12px",
                                    color: theme.palette.mode === 'light' ? "#0b0e14" : "#fff"
                                })}
                                className="bg-kai-primary hover:bg-kai-primary/70"
                            >
                                <span style={{ color: theme.palette.mode === 'light' ? "#fff" : "#000" }}>Assinar e salvar laudo</span>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}