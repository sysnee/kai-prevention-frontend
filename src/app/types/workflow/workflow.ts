import { ServiceStatus } from "../pemissions/permissions";

export interface WorkflowNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  mentions: Array<{
    id: string;
    name: string;
  }>;
}

export interface WorkflowStage {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface WorkflowTransition {
  from: string;
  to: string;
  timestamp: string;
  userId: string;
  reason?: string;
}

export interface User {
  fullName: string;
}

export interface ServiceRequestNote {
  id: string;
  content: string;
  createdAtStatus: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
}
