import { mockDelay } from "@/services/mockTransport";

export type BusinessClassification = "individual" | "registered_business" | "company";
export type BusinessApplicationStatus = "draft" | "submitted" | "under_review" | "info_required" | "approved" | "rejected" | "suspended";

export type BusinessApplicationDraft = {
  id: string;
  status: BusinessApplicationStatus;
  businessType?: string;
  classification?: BusinessClassification;
  categories: string[];
  businessName?: string;
  description?: string;
  area?: string;
  serviceRadiusKm?: number;
  offerings: {
    name: string;
    priceType: "fixed" | "starting_from" | "range" | "quote_required";
    price?: number;
    leadTime?: string;
  }[];
  documents: {
    type: string;
    required: boolean;
    uploaded: boolean;
  }[];
  submittedAt?: string;
};

let draft: BusinessApplicationDraft = {
  id: "beta-application",
  status: "draft",
  categories: [],
  offerings: [],
  documents: []
};

export const businessApplicationService = {
  async getCurrentApplication() {
    await mockDelay(180, 320);
    return draft;
  },

  async saveDraft(nextDraft: Partial<BusinessApplicationDraft>) {
    await mockDelay(220, 420);
    draft = { ...draft, ...nextDraft };
    return draft;
  },

  async submitApplication() {
    await mockDelay(520, 760);
    draft = {
      ...draft,
      status: "submitted",
      submittedAt: new Date().toISOString()
    };
    return draft;
  }
};
