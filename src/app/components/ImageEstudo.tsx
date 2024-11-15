import CheckBox from "@mui/icons-material/CheckBox";
import { Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { Imagem } from "../types/types";

export default function ImageEstudo({imagem, onSelect, width = 90, height = 90}: {imagem: Imagem, onSelect?: (imagem: Imagem, isSelected: boolean) => void, width?: number, height?: number}){
    const [isSelected, setIsSelected] = useState(false)

    function toggleSelection(){
        const newSelectionState = !isSelected
        setIsSelected(newSelectionState)
        if (onSelect) {
            onSelect(imagem, newSelectionState)
        }
    }

    return(
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: ".3em"
            }}
        >
            <span className="text-black text-xs">img {imagem.id}</span>
            {isSelected ? (
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        onClick={toggleSelection}
                        src={imagem.link}
                        alt="raio-x"
                        width={width}
                        height={height}
                        className="rounded-md cursor-pointer border-2 border-green-500"
                    />

                    <CheckBox
                        sx={{
                            color: "#00b875",
                            position: "absolute",
                            top: 0,
                            right: 6
                        }}
                     />
                </Box>
            ): (
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Image
                        onClick={toggleSelection}
                        src={imagem.link}
                        alt="raio-x"
                        width={width}
                        height={height}
                        className="rounded-md cursor-pointer"
                    />
                </Box>
            )}
        </Box>
    )
}