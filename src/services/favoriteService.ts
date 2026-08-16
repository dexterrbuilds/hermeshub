import { shouldUseMockApi } from "@/config/env";
import { apiClient } from "@/services/apiClient";
import { businessService } from "@/services/businessService";

type FavoriteRow = {
  businessId?: string;
  business_id?: string;
};

export const favoriteService = {
  async getSavedBusinessIds() {
    if (shouldUseMockApi()) {
      return businessService.getInitialSavedBusinessIds();
    }
    const rows = await apiClient.get<FavoriteRow[]>("/favorites");
    return rows.map((row) => row.businessId ?? row.business_id).filter(Boolean) as string[];
  },

  async saveBusiness(businessId: string) {
    if (shouldUseMockApi()) return { ok: true };
    return apiClient.post<{ ok: boolean }>(`/favorites/${businessId}`);
  },

  async unsaveBusiness(businessId: string) {
    if (shouldUseMockApi()) return { ok: true };
    return apiClient.delete<{ ok: boolean }>(`/favorites/${businessId}`);
  }
};
