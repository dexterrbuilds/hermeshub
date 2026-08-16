import { mockDelay } from "@/services/mockTransport";

export const businessDocumentService = {
  async uploadDocument(type: string) {
    await mockDelay(420, 760);
    return {
      type,
      storagePath: `mock/business-documents/${type}-${Date.now()}.pdf`,
      uploaded: true
    };
  },

  async removeDocument(type: string) {
    await mockDelay(180, 320);
    return { type, uploaded: false };
  }
};
