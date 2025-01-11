import api from "@/lib/api";
import { ServiceRequestNote } from "../types/workflow/workflow";

export const notesService = {
  async create(
    serviceRequestId: string,
    content: string
  ): Promise<ServiceRequestNote> {
    const response = await api.post("service-requests/notes", {
      serviceRequestId,
      content,
    });
    return response;
  },

  async findByServiceRequest(
    serviceRequestId: string
  ): Promise<ServiceRequestNote[]> {
    const response = await api.get(
      `service-requests/notes/service-request/${serviceRequestId}`
    );
    return response;
  },
};
