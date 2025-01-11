"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  RolePermissions,
  AccessLevel,
  Module,
  ServiceStatus,
} from "../../../types/pemissions/permissions";
import { Save, X } from "lucide-react";

const PERMISSION_LEVELS: Record<AccessLevel, string> = {
  none: "Nenhum",
  read: "Leitura",
  write: "Escrita",
  full: "Completo",
};

const MODULES: Module[] = ["client", "exam"];
const STAGES: ServiceStatus[] = [
  "PLANNED",
  "WAITING",
  "STARTED",
  "ON_HOLD",
  "COMPLETED",
  "TRANSCRIPTION",
  "SIGNED",
];

// Função para fornecer descrições padrão para os stages
const getDefaultStageDescription = (access: AccessLevel): string => {
  switch (access) {
    case "none":
      return "Acesso não autorizado";
    case "read":
      return "Visualizar / Consultar";
    case "write":
      return "Modificar / Consultar"; // Pode ser ajustado conforme necessário
    case "full":
      return "Acesso completo";
    default:
      return "";
  }
};

export function RoleModal({
  role,
  onSave,
  onClose,
  mode,
}: {
  role: RolePermissions | null;
  onSave: (role: RolePermissions) => void;
  onClose: () => void;
  mode: "create" | "edit" | "view";
}) {
  const [formData, setFormData] = useState<RolePermissions>({
    id: role?.id || crypto.randomUUID(),
    name: role?.name,
    isActive: role?.isActive ?? true,
    permissions:
      role?.permissions ||
      MODULES.map((module) => ({ module, access: "none" })),
    examStages:
      role?.examStages ||
      STAGES.map((stage) => ({
        stage,
        access: "none",
        description: getDefaultStageDescription("none"),
      })),
  });

  const isViewMode = mode === "view";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module: Module, access: AccessLevel) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.map((permission) =>
        permission.module === module ? { ...permission, access } : permission
      ),
    }));
  };

  const handleStageChange = (stage: ServiceStatus, access: AccessLevel) => {
    setFormData((prev) => ({
      ...prev,
      examStages: prev.examStages.map((examStage) =>
        examStage.stage === stage
          ? { ...examStage, access, description: getDefaultStageDescription(access) }
          : examStage
      ),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create"
          ? "Novo Perfil"
          : mode === "edit"
            ? "Editar Perfil"
            : "Detalhes do Perfil"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nome do Perfil"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="isActive"
            value={formData.isActive ? "active" : "inactive"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "active",
              }))
            }
            disabled={isViewMode}
          >
            <MenuItem value="active">Ativo</MenuItem>
            <MenuItem value="inactive">Inativo</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle1" sx={{ marginTop: 2, marginBottom: 1 }}>
          Permissões por Recurso
        </Typography>
        {formData.permissions.map((permission) => (
          <FormControl fullWidth margin="normal" key={permission.module}>
            <InputLabel>{permission.module}</InputLabel>
            <Select
              value={permission.access}
              onChange={(e) =>
                handlePermissionChange(
                  permission.module,
                  e.target.value as AccessLevel
                )
              }
              disabled={isViewMode}
            >
              {Object.entries(PERMISSION_LEVELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Typography variant="subtitle1" sx={{ marginTop: 2, marginBottom: 1 }}>
          Etapas do Exame
        </Typography>
        {formData.examStages.map((stage) => (
          <FormControl fullWidth margin="normal" key={stage.stage}>
            <InputLabel>{stage.stage}</InputLabel>
            <Select
              value={stage.access}
              onChange={(e) =>
                handleStageChange(stage.stage, e.target.value as AccessLevel)
              }
              disabled={isViewMode}
            >
              {Object.entries(PERMISSION_LEVELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </DialogContent>
      {!isViewMode && (
        <DialogActions>
          <Button onClick={onClose} startIcon={<X />}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            startIcon={<Save />}
          >
            Salvar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
