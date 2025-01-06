"use client";

import { Box, Button, Grid2 as Grid, Typography, Stack } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import ImageEstudo from "../../../../components/ImageEstudo";
import Link from "next/link";
import db from '../../../../../../db.json'
import { Estudo, Imagem } from "../../../../types/types";

export default function EstudoDetailPage() {
    const { id } = useParams()

    const [estudo, setEstudo] = useState<Estudo | null>(null)
    const [selectedImage, setSelectedImage] = useState<Imagem | null>(null)

    async function getEstudo() {
        try {
            const estudoData = db.estudos.find(estudo => Number(estudo.id) === parseInt(String(id)))

            if (!estudoData) {
                throw new Error("Estudo não encontrado");
            }

            setEstudo(estudoData)
        } catch (error) {
            console.log("Erro ao buscar estudo: ", error)
        }
    }

    function handleImageSelection(imagem: Imagem, isSelected: boolean) {
        if (isSelected) {
            setSelectedImage(imagem)
        } else {
            setSelectedImage(null)
        }
    }

    useEffect(() => {
        getEstudo();
    }, [])

    return (
        <Box
            sx={{
                padding: "1.8em",
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5em"
                }}
            >
                <Link href={`/`}>
                    <Button className="bg-kai-primary hover:bg-kai-primary/70">
                        <KeyboardArrowLeft sx={(theme) => ({
                            color: theme.palette.mode === 'light' ? '#fff' : '#000'
                        })} />
                    </Button>
                </Link>

                <Box
                    component="h2"
                    sx={(theme) => ({
                        fontSize: '26px',
                        color: theme.palette.text.primary,
                    })}
                >
                    Estudo: ID: {id}
                </Box>
            </Box>

            <Box
                sx={{
                    marginTop: "3em"
                }}
            >
                {estudo && (
                    estudo.imagens.length > 0 ? (
                        <Stack spacing={2}>
                            <Box
                                component="h2"
                                sx={(theme) => ({
                                    fontSize: "16px",
                                    color: theme.palette.text.primary
                                })}
                            >
                                Selecione uma <Box component="span" sx={{ color: '#FF8046' }}>imagem chave</Box> para adicionar seus achados:
                            </Box>
                            <Grid
                                container
                                spacing={1.5}
                                justifyContent="start"
                                marginTop={1}
                                wrap="wrap"
                            >
                                {estudo.imagens.map(imagem => (
                                    <Grid
                                        key={imagem.id}
                                        size={{ xs: 3, sm: 2, md: 1.5, lg: 1 }}
                                    >
                                        <ImageEstudo
                                            imagem={imagem}
                                            onSelect={handleImageSelection}
                                            width={400}
                                            height={450}
                                            isSelected={selectedImage?.id === imagem.id}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    ) : (
                        <Box
                            component="h2"
                            sx={(theme) => ({
                                fontSize: "16px",
                                color: theme.palette.text.primary
                            })}
                        >
                            Nenhuma imagem encontrada.
                        </Box>
                    )
                )}
            </Box>

            {estudo && estudo.imagens.length > 0 && (
                <Box
                    sx={(theme) => ({
                        marginTop: "3em",
                        backgroundColor: theme.palette.mode === 'light' ? "#f5f6fa" : "#0c1017",
                        padding: "2em",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1em',
                        borderRadius: "10px",
                        boxShadow: "2px 2px 4px rgb(0, 0, 0, 0.1)"
                    })}
                >
                    {selectedImage ? (
                        <>
                            <Button
                                onClick={() => setSelectedImage(null)}
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
                                    border: "1px solid #e5e7eb"
                                })}
                                className="text-kai-primary transition-colors hover:bg-kai-primary/10"
                            >
                                Cancelar
                            </Button>

                            <Link href={`/dashboard/estudos/${id}/achados`}>
                                <Button
                                    className="bg-kai-primary hover:bg-kai-primary/70"
                                    endIcon={<KeyboardArrowRight sx={(theme) => ({
                                        color: theme.palette.mode === 'light' ? '#fff' : '#000'
                                    })} />}
                                >
                                    <Typography sx={(theme) => ({
                                        color: theme.palette.mode === 'light' ? '#fff' : '#000'
                                    })}>
                                        Salvar e avançar
                                    </Typography>
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href={`/dashboard/estudos/${id}/achados`}>
                            <Button
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
                                    border: "1px solid #e5e7eb"
                                })}
                                className="text-kai-primary transition-colors hover:bg-kai-primary/10"
                                endIcon={<KeyboardArrowRight />}
                            >
                                Avançar sem imagem
                            </Button>
                        </Link>
                    )}
                </Box>
            )}
        </Box>
    )
}