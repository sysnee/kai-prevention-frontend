import { Checkbox } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box, Modal } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { Imagem } from "../types/types";

interface ImageEstudoProps {
    imagem: Imagem
    onSelect?: (imagem: Imagem, isSelected: boolean) => void
    width?: number
    height?: number
    isSelected?: boolean
    showCheckbox?: boolean
    onZoom?: () => void
}

export default function ImageEstudo({ imagem, onSelect, width = 90, height = 90, isSelected = false, showCheckbox = true, onZoom }: ImageEstudoProps) {
    function toggleSelection(e: React.MouseEvent) {
        e.stopPropagation();
        if (onSelect) {
            onSelect(imagem, !isSelected)
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: ".3em",
                transition: "all 0.3s ease-in-out",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                zIndex: isSelected ? 1 : 0,
                width: isSelected ? '100%' : 'auto',
                gridColumn: isSelected ? '1 / -1' : 'auto',
            }}
        >
            {isSelected ? (
                <Box
                    onClick={onZoom}
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        width: '100%',
                        height: '100%',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s ease-in-out'
                        }
                    }}
                >
                    <Image
                        onClick={(e) => e.stopPropagation()}
                        src={imagem.link}
                        alt="raio-x"
                        width={width}
                        height={height}
                        className="rounded-md cursor-pointer border-2 border-[#FF8046]"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />

                    {showCheckbox && (
                        <CheckBoxIcon
                            onClick={toggleSelection}
                            sx={{
                                color: "#FF8046",
                                position: "absolute",
                                top: 8,
                                right: 8,
                                fontSize: '28px',
                                animation: "fadeIn 0.3s ease-in-out",
                                "@keyframes fadeIn": {
                                    "0%": {
                                        opacity: 0,
                                        transform: "scale(0.8)",
                                    },
                                    "100%": {
                                        opacity: 1,
                                        transform: "scale(1)",
                                    },
                                },
                            }}
                        />
                    )}
                </Box>
            ) : (
                <Box
                    onClick={onZoom}
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        width: '100px',
                        height: '100px',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s ease-in-out'
                        }
                    }}
                >
                    <Image
                        onClick={toggleSelection}
                        src={imagem.link}
                        alt="raio-x"
                        width={100}
                        height={100}
                        className="rounded-md border border-gray-200 cursor-pointer transition-all duration-200 hover:border-[#FF8046]/50"
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </Box>
            )}
        </Box>
    )
}