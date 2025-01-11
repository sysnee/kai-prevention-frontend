import { getExamAccessDescription } from "../dashboard/permissions/utils/permissionUtils";
import { RolePermissions } from "../types/pemissions/permissions";

export const mockRolePermissions: RolePermissions[] = [
  {
    id: "1",
    name: "Recepcionista",
    isActive: true,
    permissions: [
      { module: "client", access: "write" },
      { module: "exam", access: "read" },
    ],
    examStages: [
      {
        stage: "PLANNED",
        access: "write",
        description: getExamAccessDescription(
          "PLANNED",
          "write",
          "Recepcionista"
        ),
      },
      {
        stage: "WAITING",
        access: "write",
        description: getExamAccessDescription(
          "WAITING",
          "write",
          "Recepcionista"
        ),
      },
      {
        stage: "STARTED",
        access: "read",
        description: getExamAccessDescription(
          "STARTED",
          "read",
          "Recepcionista"
        ),
      },
      {
        stage: "ON_HOLD",
        access: "read",
        description: getExamAccessDescription(
          "ON_HOLD",
          "read",
          "Recepcionista"
        ),
      },
      {
        stage: "COMPLETED",
        access: "read",
        description: getExamAccessDescription(
          "COMPLETED",
          "read",
          "Recepcionista"
        ),
      },
      {
        stage: "TRANSCRIPTION",
        access: "none",
        description: getExamAccessDescription(
          "TRANSCRIPTION",
          "none",
          "Recepcionista"
        ),
      },
      {
        stage: "SIGNED",
        access: "none",
        description: getExamAccessDescription(
          "SIGNED",
          "none",
          "Recepcionista"
        ),
      },
    ],
  },
  {
    id: "2",
    name: "Enfermeiro",
    isActive: true,
    permissions: [
      { module: "client", access: "write" },
      { module: "exam", access: "write" },
    ],
    examStages: [
      {
        stage: "PLANNED",
        access: "write",
        description: getExamAccessDescription("PLANNED", "write", "Enfermeiro"),
      },
      {
        stage: "WAITING",
        access: "write",
        description: getExamAccessDescription("WAITING", "write", "Enfermeiro"),
      },
      {
        stage: "STARTED",
        access: "read",
        description: getExamAccessDescription("STARTED", "read", "Enfermeiro"),
      },
      {
        stage: "ON_HOLD",
        access: "read",
        description: getExamAccessDescription("ON_HOLD", "read", "Enfermeiro"),
      },
      {
        stage: "COMPLETED",
        access: "read",
        description: getExamAccessDescription(
          "COMPLETED",
          "read",
          "Enfermeiro"
        ),
      },
      {
        stage: "TRANSCRIPTION",
        access: "write",
        description: getExamAccessDescription(
          "TRANSCRIPTION",
          "write",
          "Enfermeiro"
        ),
      },
      {
        stage: "SIGNED",
        access: "none",
        description: getExamAccessDescription("SIGNED", "none", "Enfermeiro"),
      },
    ],
  },
  {
    id: "3",
    name: "Biomedico",
    isActive: true,
    permissions: [
      { module: "client", access: "read" },
      { module: "exam", access: "write" },
    ],
    examStages: [
      {
        stage: "PLANNED",
        access: "write",
        description: getExamAccessDescription("PLANNED", "write", "Biomedico"),
      },
      {
        stage: "WAITING",
        access: "write",
        description: getExamAccessDescription("WAITING", "write", "Biomedico"),
      },
      {
        stage: "STARTED",
        access: "read",
        description: getExamAccessDescription("STARTED", "read", "Biomedico"),
      },
      {
        stage: "ON_HOLD",
        access: "read",
        description: getExamAccessDescription("ON_HOLD", "read", "Biomedico"),
      },
      {
        stage: "COMPLETED",
        access: "read",
        description: getExamAccessDescription("COMPLETED", "read", "Biomedico"),
      },
      {
        stage: "TRANSCRIPTION",
        access: "write",
        description: getExamAccessDescription(
          "TRANSCRIPTION",
          "write",
          "Biomedico"
        ),
      },
      {
        stage: "SIGNED",
        access: "none",
        description: getExamAccessDescription("SIGNED", "none", "Biomedico"),
      },
    ],
  },
  {
    id: "4",
    name: "Radiologista",
    isActive: true,
    permissions: [
      { module: "client", access: "read" },
      { module: "exam", access: "write" },
    ],
    examStages: [
      {
        stage: "PLANNED",
        access: "write",
        description: getExamAccessDescription(
          "PLANNED",
          "write",
          "Radiologista"
        ),
      },
      {
        stage: "WAITING",
        access: "write",
        description: getExamAccessDescription(
          "WAITING",
          "write",
          "Radiologista"
        ),
      },
      {
        stage: "STARTED",
        access: "read",
        description: getExamAccessDescription(
          "STARTED",
          "read",
          "Radiologista"
        ),
      },
      {
        stage: "ON_HOLD",
        access: "read",
        description: getExamAccessDescription("ON_HOLD", "read", "Radiologista"),
      },
      {
        stage: "COMPLETED",
        access: "read",
        description: getExamAccessDescription(
          "COMPLETED",
          "read",
          "Radiologista"
        ),
      },
      {
        stage: "TRANSCRIPTION",
        access: "write",
        description: getExamAccessDescription(
          "TRANSCRIPTION",
          "write",
          "Radiologista"
        ),
      },
      {
        stage: "SIGNED",
        access: "none",
        description: getExamAccessDescription("SIGNED", "none", "Radiologista"),
      },
    ],
  },
  {
    id: "5",
    name: "HeadDoctor",
    isActive: true,
    permissions: [
      { module: "client", access: "write" },
      { module: "exam", access: "write" },
    ],
    examStages: [
      {
        stage: "PLANNED",
        access: "write",
        description: getExamAccessDescription("PLANNED", "write", "HeadDoctor"),
      },
      {
        stage: "WAITING",
        access: "write",
        description: getExamAccessDescription("WAITING", "write", "HeadDoctor"),
      },
      {
        stage: "STARTED",
        access: "read",
        description: getExamAccessDescription("STARTED", "read", "HeadDoctor"),
      },
      {
        stage: "ON_HOLD",
        access: "read",
        description: getExamAccessDescription("ON_HOLD", "read", "HeadDoctor"),
      },
      {
        stage: "COMPLETED",
        access: "read",
        description: getExamAccessDescription(
          "COMPLETED",
          "read",
          "HeadDoctor"
        ),
      },
      {
        stage: "TRANSCRIPTION",
        access: "write",
        description: getExamAccessDescription(
          "TRANSCRIPTION",
          "write",
          "HeadDoctor"
        ),
      },
      {
        stage: "SIGNED",
        access: "none",
        description: getExamAccessDescription("SIGNED", "none", "HeadDoctor"),
      },
    ],
  },
  {
    id: "6",
    name: "Master",
    isActive: true,
    permissions: [
      { module: "client", access: "full" },
      { module: "exam", access: "full" },
    ],
    examStages: [
      {
        stage: "PLANNED",
        access: "write",
        description: getExamAccessDescription("PLANNED", "write", "Master"),
      },
      {
        stage: "WAITING",
        access: "write",
        description: getExamAccessDescription("WAITING", "write", "Master"),
      },
      {
        stage: "STARTED",
        access: "read",
        description: getExamAccessDescription("STARTED", "read", "Master"),
      },
      {
        stage: "ON_HOLD",
        access: "read",
        description: getExamAccessDescription("ON_HOLD", "read", "Master"),
      },
      {
        stage: "COMPLETED",
        access: "read",
        description: getExamAccessDescription("COMPLETED", "read", "Master"),
      },
      {
        stage: "TRANSCRIPTION",
        access: "write",
        description: getExamAccessDescription(
          "TRANSCRIPTION",
          "write",
          "Master"
        ),
      },
      {
        stage: "SIGNED",
        access: "none",
        description: getExamAccessDescription("SIGNED", "none", "Master"),
      },
    ],
  },
];
