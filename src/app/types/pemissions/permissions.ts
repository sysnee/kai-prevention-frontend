export type AccessLevel = "none" | "read" | "write" | "full";

export type Role =
  | "Recepcionista"
  | "Enfermeiro"
  | "Biomedico"
  | "Radiologista"
  | "HeadDoctor"
  | "Master";

export type Module = "client" | "exam";

export type ExamStatus =
  | "planned"
  | "waiting"
  | "started"
  | "onhold"
  | "completed"
  | "transcription"
  | "revision"
  | "signed";

export enum ExamStatusEnum {
  PLANNED = "Planejado",
  WAITING = "Aguardando",
  STARTED = "Iniciado",
  ONHOLD = "Pausado",
  COMPLETED = "Concluído",
  TRANSCRIPTION = "Transcrição",
  REVISION = "Revisão",
  SIGNED = "Assinado",
}

export interface ExamStageAccess {
  stage: ExamStatus;
  access: AccessLevel;
  description: string;
}

export interface Permission {
  module: Module;
  access: AccessLevel;
}

export interface RolePermissions {
  id: string;
  name: Role | undefined;
  isActive: boolean;
  permissions: Permission[];
  examStages: ExamStageAccess[];
}
