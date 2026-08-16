import { businessService } from "@/services/businessService";
import { bookingService } from "@/services/bookingService";
import { paymentService } from "@/services/paymentService";
import { reviewService } from "@/services/reviewService";
import { searchService } from "@/services/searchService";

export const marketplaceService = {
  getCategories: businessService.getCategories,
  getNearbyVendors: businessService.getNearbyBusinesses,
  getNearbyVendorsByLocation: businessService.getNearbyBusinessesByLocation,
  getVendorById: businessService.getBusinessById,
  getVendorServices: businessService.getBusinessServices,
  getServiceById: businessService.getServiceById,
  getVendorsByCategory: businessService.getBusinessesByCategory,
  getDefaultService: businessService.getDefaultService,
  getVendorReviews: reviewService.getBusinessReviews,
  searchVendors: searchService.searchBusinesses,
  getActiveOrder: bookingService.getActiveOrder,
  getOrders: bookingService.getOrders,
  confirmBooking: bookingService.confirmBooking,
  getWallet: paymentService.getWallet,
  submitReview: reviewService.submitReview
};
