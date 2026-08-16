import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { businessService } from "@/services/businessService";
import { favoriteService } from "@/services/favoriteService";
import { Vendor } from "@/types/marketplace";

type MarketplaceState = {
  savedVendorIds: string[];
  recentSearches: string[];
  recentlyViewed: Vendor[];
  toggleSavedVendor: (vendorId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewed: (vendorId: string) => void;
};

const MarketplaceStateContext = createContext<MarketplaceState | undefined>(undefined);

export function MarketplaceStateProvider({ children }: { children: ReactNode }) {
  const [savedVendorIds, setSavedVendorIds] = useState(() => businessService.getInitialSavedBusinessIds());
  const [recentSearches, setRecentSearches] = useState(["barber near Bodija", "birthday cake Akobo", "laundry pickup UI"]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    favoriteService.getSavedBusinessIds()
      .then((ids) => {
        if (mounted) setSavedVendorIds(ids);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSavedVendor = useCallback((vendorId: string) => {
    const shouldSave = !savedVendorIds.includes(vendorId);
    setSavedVendorIds((current) => shouldSave ? [vendorId, ...current] : current.filter((id) => id !== vendorId));
    const request = shouldSave ? favoriteService.saveBusiness(vendorId) : favoriteService.unsaveBusiness(vendorId);
    request.catch(() => {
      setSavedVendorIds((current) =>
        shouldSave ? current.filter((id) => id !== vendorId) : [vendorId, ...current]
      );
    });
  }, [savedVendorIds]);

  const addRecentSearch = useCallback((query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setRecentSearches((current) => [clean, ...current.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6));
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const addRecentlyViewed = useCallback((vendorId: string) => {
    setRecentlyViewedIds((current) => {
      const next = [vendorId, ...current.filter((id) => id !== vendorId)].slice(0, 6);
      return next.join("|") === current.join("|") ? current : next;
    });
  }, []);

  const value = useMemo<MarketplaceState>(() => ({
    savedVendorIds,
    recentSearches,
    recentlyViewed: businessService.getBusinessesByIds(recentlyViewedIds) as Vendor[],
    toggleSavedVendor,
    addRecentSearch,
    clearRecentSearches,
    addRecentlyViewed
  }), [addRecentSearch, addRecentlyViewed, clearRecentSearches, recentSearches, recentlyViewedIds, savedVendorIds, toggleSavedVendor]);

  return <MarketplaceStateContext.Provider value={value}>{children}</MarketplaceStateContext.Provider>;
}

export function useMarketplaceState() {
  const context = useContext(MarketplaceStateContext);
  if (!context) {
    throw new Error("useMarketplaceState must be used inside MarketplaceStateProvider");
  }
  return context;
}
