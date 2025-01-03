"use client";

import { useState } from "react"
import db from "../../../../../../db.json"
import { Box, Button, Checkbox, FormControlLabel, Grid2 as Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Check, KeyboardArrowLeft } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import AchadoCard from "@/app/components/AchadoCard";
import AchadoForm from "@/app/components/AchadoForm";
import { Achado } from "@/app/types/types";

export default function AchadosPage() {

    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isExamNormalChecked, setIsExamNormalChecked] = useState(false)
    const [editAchado, setEditAchado] = useState<Achado | null>(null);
    const [achados, setAchados] = useState<Achado[]>([]);

    function handleAddAchado(achado: Achado) {
        const ultimoAchado = achados[achados.length - 1];
        const novoId = ultimoAchado ? parseInt(ultimoAchado.id) + 1 : 1;

        const novoAchado = {
            ...achado,
            id: novoId.toString(),
            titulo: `Achado ${novoId}`,
            laudoId: "1",
            imageId: "1",
        }

        setAchados([...achados, novoAchado]);
        setIsFormVisible(false);
    };

    function handleEditAchado(updatedAchado: Achado) {
        const updatedAchados = achados.map(achado =>
            achado.id === updatedAchado.id ? updatedAchado : achado
        );
        setAchados(updatedAchados);
        setEditAchado(null);
        setIsFormVisible(false);
    }

    return (
        <Box
            sx={{
                padding: "1.8em",
                height: "100vh",
                width: "100%"
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
                        color: theme.palette.text.primary,
                        fontSize: "22px"
                    })}
                >
                    Img {db.achados[0].imagemId}
                </Box>
            </Box>

            <Box
                sx={{
                    marginTop: "1em"
                }}
            >
                <Grid
                    container
                    spacing={2}
                    marginTop={1}
                    wrap="wrap"
                    alignItems="flex-start"
                >


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
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <FormControlLabel
                                sx={(theme) => ({
                                    color: theme.palette.mode === 'light' ? "#0b0e14" : "#fff",
                                    display: "flex",
                                    justifyContent: "start"
                                })}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={isExamNormalChecked}
                                        onChange={() => {
                                            setIsExamNormalChecked(!isExamNormalChecked)
                                            if (!isExamNormalChecked) {
                                                setAchados([])
                                                setIsFormVisible(false)
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Box
                                        sx={(theme) => ({
                                            color: theme.palette.text.primary,
                                            fontSize: "12px"
                                        })}
                                    >
                                        Nada a adicionar
                                    </Box>
                                }
                            />


                            {isExamNormalChecked ? (
                                <Button
                                    className="bg-kai-primary hover:bg-kai-primary/70 flex items-center"
                                >
                                    <Check sx={(theme) => ({
                                        color: theme.palette.mode === 'light' ? '#fff' : '#000',
                                        fontSize: "18px"
                                    })} />
                                    <Typography sx={(theme) => ({
                                        color: theme.palette.mode === 'light' ? '#fff' : '#000'
                                    })}>
                                        Concluir
                                    </Typography>
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setIsFormVisible(true)}
                                    className="bg-kai-primary hover:bg-kai-primary/70 flex items-center"
                                >
                                    <AddIcon sx={(theme) => ({
                                        color: theme.palette.mode === 'light' ? '#fff' : '#000',
                                        fontSize: "18px"
                                    })} />
                                    <Typography sx={(theme) => ({
                                        color: theme.palette.mode === 'light' ? '#fff' : '#000'
                                    })}>
                                        Adicionar achado
                                    </Typography>
                                </Button>
                            )}
                        </Box>

                        {isFormVisible && (
                            <Box
                                sx={{
                                    width: "100%",
                                    marginTop: "2em"
                                }}
                            >
                                <AchadoForm
                                    achadoToEdit={editAchado}
                                    onCancel={() => {
                                        setIsFormVisible(false)
                                        setEditAchado(null)
                                    }}
                                    onSubmit={editAchado ? handleEditAchado : handleAddAchado}
                                />
                            </Box>
                        )}

                        <Box
                            sx={{
                                width: "100%"
                            }}
                        >
                            <Stack
                                spacing={2}
                                marginTop={2}
                            >
                                {achados.length > 0 ? (achados.map(achado => (
                                    <AchadoCard
                                        key={achado.id}
                                        achado={achado}
                                        onEdit={() => {
                                            setEditAchado(achado)
                                            setIsFormVisible(true)
                                        }}
                                    />
                                ))) : (
                                    <Typography
                                        sx={{
                                            fontSize: "13px"
                                        }}
                                    >
                                        Não foram encontrados achados.
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid
                        size={{ xs: 12, md: 5 }}
                    >
                        <Box>
                            <Box
                                component="img"
                                src={db.estudos[0].imagens[0].link}
                                alt="raio-x"
                                sx={{
                                    width: "100%",
                                    height: "auto"
                                }}
                                className="rounded-lg cursor-pointer border"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}