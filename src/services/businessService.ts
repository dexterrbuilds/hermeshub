import { categories, services, vendors } from "@/data/mockMarketplace";
import { apiClient } from "@/services/apiClient";
import { mapApiService, mapBusinessToVendor } from "@/services/apiMappers";
import { CategoryId } from "@/types/marketplace";
import { shouldUseMockApi } from "@/config/env";
import { mockDelay } from "@/services/mockTransport";

export const businessService = {
  async getCategories() {
    if (!shouldUseMockApi()) {
      const items = await apiClient.get<Array<{ id: string; name: string; slug: string; icon: string; parentId?: string }>>("/categories");
      return items
        .filter((item) => !item.parentId)
        .map((item) => ({ id: item.slug as CategoryId, name: item.name, icon: item.icon, description: "Explore nearby businesses" }));
    }
    await mockDelay();
    return categories;
  },

  async getNearbyBusinesses() {
    if (!shouldUseMockApi()) {
      const items = await apiClient.get<unknown[]>("/businesses/search");
      return items.map((item) => mapBusinessToVendor(item as never));
    }
    await mockDelay();
    return [...vendors].sort((a, b) => a.distanceKm - b.distanceKm);
  },

  async getNearbyBusinessesByLocation(latitude: number, longitude: number, radius = 10, categoryId?: CategoryId) {
    if (!shouldUseMockApi()) {
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        radius: String(radius)
      });
      if (categoryId) params.set("category", categoryId);
      const items = await apiClient.get<unknown[]>(`/businesses/nearby?${params.toString()}`);
      return items.map((item) => mapBusinessToVendor(item as never));
    }
    await mockDelay();
    return vendors
      .filter((vendor) => !categoryId || vendor.categoryId === categoryId)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },

  async getBusinessById(id: string) {
    if (!shouldUseMockApi()) {
      return mapBusinessToVendor(await apiClient.get<never>(`/businesses/${id}`));
    }
    await mockDelay();
    return vendors.find((vendor) => vendor.id === id);
  },

  async getBusinessServices(businessId: string) {
    if (!shouldUseMockApi()) {
      const business = await apiClient.get<{ services?: never[] }>(`/businesses/${businessId}`);
      return (business.services ?? []).map(mapApiService);
    }
    await mockDelay();
    return services.filter((service) => service.vendorId === businessId);
  },

  async getServiceById(id: string) {
    if (!shouldUseMockApi()) {
      return mapApiService(await apiClient.get<never>(`/services/${id}`));
    }
    await mockDelay();
    return services.find((service) => service.id === id);
  },

  async getBusinessesByCategory(categoryId: CategoryId) {
    if (!shouldUseMockApi()) {
      const items = await apiClient.get<unknown[]>(`/businesses/search?category=${encodeURIComponent(categoryId)}`);
      return items.map((item) => mapBusinessToVendor(item as never));
    }
    await mockDelay();
    return vendors.filter((vendor) => vendor.categoryId === categoryId);
  },

  getDefaultService() {
    return services[2];
  },

  getDemoBusinesses(ids: string[]) {
    return ids.map((id) => vendors.find((vendor) => vendor.id === id) ?? vendors[0]);
  },

  getInitialSavedBusinessIds() {
    return vendors.filter((vendor) => vendor.saved).map((vendor) => vendor.id);
  },

  getBusinessesByIds(ids: string[]) {
    return ids.map((id) => vendors.find((vendor) => vendor.id === id)).filter(Boolean);
  }
};
