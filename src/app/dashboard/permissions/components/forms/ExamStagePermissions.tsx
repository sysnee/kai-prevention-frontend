"use client";

import { ExamStageAccess } from "@/app/types/pemissions/permissions";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

interface ExamStagePermissionsProps {
  stages: ExamStageAccess[];
  onChange: (stages: ExamStageAccess[]) => void;
  onCustomChange?: () => void;
  disabled?: boolean;
}

export default function ExamStagePermissions({
  stages,
  onChange,
  onCustomChange,
  disabled,
}: ExamStagePermissionsProps) {
  const handleStageChange = (stage: string, access: string) => {
    const newStages = stages.map((s) =>
      s.stage === stage
        ? { ...s, access: access as "none" | "read" | "write" | "full" }
        : s
    );
    onChange(newStages);
    onCustomChange?.();
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "planned":
        return "Planejado";
      case "waiting":
        return "Aguardando";
      case "started":
        return "Iniciado";
      case "ON_HOLD":
        return "Pausado";
      case "completed":
        return "Concluído";
      case "transcription":
        return "Transcrição";
      case "revision":
        return "Revisão";
      case "signed":
        return "Assinado";
      default:
        return stage;
    }
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      }}
      gap={2}
    >
      {stages.map((stage) => (
        <Box key={stage.stage} width="100%">
          <FormControl fullWidth>
            <InputLabel>{getStageLabel(stage.stage)}</InputLabel>
            <Select
              value={stage.access}
              label={getStageLabel(stage.stage)}
              onChange={(e) => handleStageChange(stage.stage, e.target.value)}
              disabled={disabled}
            >
              <MenuItem value="none">Nenhum</MenuItem>
              <MenuItem value="read">Visualizar</MenuItem>
              <MenuItem value="write">Modificar</MenuItem>
              <MenuItem value="full">Completo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      ))}
    </Box>
  );
}
