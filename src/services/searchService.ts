import { services, vendors } from "@/data/mockMarketplace";
import { shouldUseMockApi } from "@/config/env";
import { apiClient } from "@/services/apiClient";
import { mapBusinessToVendor } from "@/services/apiMappers";
import { mockDelay } from "@/services/mockTransport";

export const searchService = {
  async searchBusinesses(query: string) {
    if (!shouldUseMockApi()) {
      const items = await apiClient.get<unknown[]>(`/businesses/search?q=${encodeURIComponent(query)}`);
      return items.map((item) => mapBusinessToVendor(item as never));
    }
    await mockDelay();
    const normalized = query
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .trim();

    if (!normalized) {
      return vendors;
    }

    const stopWords = new Set(["near", "me", "around", "in", "ibadan", "the", "a", "an", "for"]);
    const tokens = normalized.split(/\s+/).filter((token) => token.length > 1 && !stopWords.has(token));

    return vendors.filter((vendor) => {
      const vendorServices = services
        .filter((service) => service.vendorId === vendor.id)
        .flatMap((service) => [service.name, service.description])
        .join(" ");

      const haystack = [
        vendor.businessName,
        vendor.category,
        vendor.area,
        vendor.description,
        vendor.tagline,
        vendor.availability,
        vendorServices
      ]
        .join(" ")
        .toLowerCase();

      return tokens.length ? tokens.every((token) => haystack.includes(token)) : true;
    });
  }
};
