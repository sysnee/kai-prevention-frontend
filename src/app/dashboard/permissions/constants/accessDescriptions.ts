import { AccessLevel, Role, ServiceStatus } from "@/app/types/pemissions/permissions";

type AccessDescription = string | Partial<Record<Role, string>>;

export const examAccessDescriptions: Record<
  ServiceStatus,
  Record<AccessLevel, string | Partial<Record<Role, string>>>
> = {
  PLANNED: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Recepcionista: "Agendar, editar, cancelar e reagendar exames",
    },
    full: "Acesso completo",
  },
  WAITING: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Recepcionista: "Confirmar chegada, atualizar status",
    },
    full: "Acesso completo",
  },
  STARTED: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Enfermeiro: "Preparar paciente e atualizar observações",
      Biomedico: "Iniciar, realizar, registrar observações do exame",
    },
    full: "Acesso completo",
  },
  ON_HOLD: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Enfermeiro: "Preparar paciente e atualizar observações",
      Biomedico: "Iniciar, realizar, registrar observações do exame",
    },
    full: "Acesso completo",
  },
  COMPLETED: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Enfermeiro: "Preparar paciente e atualizar observações",
      Biomedico: "Iniciar, realizar, registrar observações do exame",
    },
    full: "Acesso completo",
  },
  TRANSCRIPTION: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Recepcionista: "Transcrever, criar, editar achados",
    },
    full: "Acesso completo",
  },
  IN_REVISION: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: {
      Recepcionista: "Transcrever, assinar laudo",
    },
    full: "Acesso completo",
  },
  SIGNED: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: "Não aplicável",
    full: "Acesso completo",
  },
  CANCELED: {
    none: "Acesso não autorizado",
    read: "Visualizar / Consultar",
    write: "Não aplicável",
    full: "Acesso completo",
  },
};

export const patientAccessDescriptions: Record<AccessLevel, AccessDescription> =
{
  none: "Acesso não autorizado",
  read: "Visualizar informações do paciente",
  write: {
    Recepcionista: "Criar e editar registros de clientes",
    Enfermeiro: "Gerenciar informações clínicas do clientes",
    HeadDoctor: "Aprovar modificações em registros de clientes",
  },
  full: "Acesso e controle total sobre registros de clientes",
};