"use client";

import { useState } from "react"
import db from "../../../../../../db.json"
import { Box, Button, Checkbox, FormControlLabel, Grid2 as Grid, Stack, Typography, Modal } from "@mui/material";
import Link from "next/link";
import { Check, KeyboardArrowLeft, Close, ZoomIn } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import AchadoCard from "@/app/components/AchadoCard";
import AchadoForm from "@/app/components/AchadoForm";
import { Achado, Imagem } from "@/app/types/types";
import ImageEstudo from "@/app/components/ImageEstudo";
import Image from "next/image";

export default function AchadosPage() {

    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isExamNormalChecked, setIsExamNormalChecked] = useState(false)
    const [editAchado, setEditAchado] = useState<Achado | null>(null);
    const [achados, setAchados] = useState<Achado[]>([]);
    const [selectedImage, setSelectedImage] = useState<Imagem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleAddAchado(achado: Achado) {
        const ultimoAchado = achados[achados.length - 1];
        const novoId = ultimoAchado ? parseInt(ultimoAchado.id) + 1 : 1;

        const novoAchado = {
            ...achado,
            id: novoId.toString(),
            titulo: `Achado ${novoId}`,
            laudoId: "1",
            imageId: selectedImage?.id || "",
        }

        setAchados([...achados, novoAchado]);
        setIsFormVisible(false);
        setSelectedImage(null);
    };

    function handleEditAchado(updatedAchado: Achado) {
        const updatedAchados = achados.map(achado =>
            achado.id === updatedAchado.id ? updatedAchado : achado
        );
        setAchados(updatedAchados);
        setEditAchado(null);
        setIsFormVisible(false);
        setSelectedImage(null);
    }

    function handleImageSelection(imagem: Imagem, isSelected: boolean) {
        setSelectedImage(isSelected ? imagem : null);
        if (isSelected) {
            setIsFormVisible(true);
        }
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
                    Novos achados
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
                                    selectedImage={selectedImage}
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
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Imagem selecionada:
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            '&:hover .action-buttons': {
                                                opacity: 1,
                                            },
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
        </Box>
    )
}