import { AccessLevel, Role, ServiceStatus } from "@/app/types/pemissions/permissions";
import { examAccessDescriptions, patientAccessDescriptions } from "../constants/accessDescriptions";

export function getPatientAccessDescription(
  accessLevel: AccessLevel,
  role: Role
): string {
  try {
    const description = patientAccessDescriptions[accessLevel];
    if (typeof description === "string") {
      return description;
    }
    return description?.[role] || "Modificar / Consultar";
  } catch (error) {
    console.error("Error getting patient access description:", error);
    return accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1);
  }
}

export function getExamAccessDescription(
  status: ServiceStatus,
  accessLevel: AccessLevel,
  role: Role
): string {
  try {
    const description = examAccessDescriptions[status]?.[accessLevel];
    if (!description) {
      return accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1);
    }
    if (typeof description === "string") {
      return description;
    }
    return description[role] || "Modificar / Consultar";
  } catch (error) {
    console.error("Error getting exam access description:", error);
    return accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1);
  }
}