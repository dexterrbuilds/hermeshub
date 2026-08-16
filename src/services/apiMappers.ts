import { CategoryId, Order, Review, Service, Vendor } from "@/types/marketplace";

const fallbackCategory: CategoryId = "more";

type ApiCategory = { id: string; name: string; slug: string; icon?: string };

const categorySlugMap: Record<string, CategoryId> = {
  beauty: "beauty",
  barbers: "beauty",
  hairdressers: "beauty",
  braiders: "beauty",
  makeup: "beauty",
  nails: "beauty",
  food: "food",
  bakers: "food",
  caterers: "food",
  chefs: "food",
  "food-vendors": "food",
  home: "home",
  plumbers: "home",
  electricians: "home",
  "interior-decor": "home",
  repairs: "repairs",
  mechanics: "automotive",
  "phone-repair": "tech",
  "laptop-repair": "tech",
  fashion: "fashion",
  tailors: "fashion",
  "fashion-design": "fashion",
  events: "events",
  photographers: "events",
  videographers: "events",
  "event-decor": "events",
  cleaning: "cleaning",
  laundry: "cleaning",
  cleaners: "cleaning",
  tech: "tech",
  wellness: "wellness",
  trainers: "wellness",
  learning: "learning",
  tutors: "learning",
  automotive: "automotive"
};

type ApiBusiness = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  verificationStatus?: string;
  averageRating?: number | string;
  reviewCount?: number;
  completedBookingCount?: number;
  phone?: string;
  email?: string;
  acceptsBookings?: boolean;
  area?: string;
  city?: string;
  state?: string;
  serviceRadiusKm?: number;
  coverImageUrl?: string;
  distanceKm?: number | string;
  servicePreview?: ApiService[];
  categories?: ApiCategory[];
  location?: {
    address?: string;
    area?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    serviceRadiusKm?: number;
  };
  services?: ApiService[];
  recentReviews?: unknown[];
};

type ApiService = {
  id: string;
  businessId?: string;
  business_id?: string;
  name: string;
  description?: string;
  priceType?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  durationMinutes?: number;
  bookingType?: "booking" | "delivery" | "quote";
  imageUrl?: string;
};

type ApiBooking = {
  id: string;
  bookingReference: string;
  status: string;
  requestedDate: string;
  requestedTime: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  business: { id: string; name: string; coverImageUrl?: string; phone?: string };
  service: { id: string; name: string; bookingType?: "booking" | "delivery"; durationMinutes?: number };
  timeline?: { newStatus: string; createdAt: string }[];
};

type ApiReview = {
  id: string;
  businessId?: string;
  business_id?: string;
  customerName?: string;
  customer_name?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  created_at?: string;
  serviceUsed?: string;
  service_used?: string;
};

export function mapBusinessToVendor(item: ApiBusiness): Vendor {
  const category = item.categories?.[0];
  const categoryId = categorySlugMap[category?.slug ?? ""] ?? fallbackCategory;
  const rating = Number(item.averageRating ?? 0);
  const firstService = item.servicePreview?.[0] ?? item.services?.[0];
  return {
    id: item.id,
    businessName: item.name,
    categoryId,
    category: category?.name ?? "Local business",
    area: (item.location?.area ?? item.area ?? "Bodija") as Vendor["area"],
    distanceKm: Number(item.distanceKm ?? 0),
    rating,
    reviewCount: item.reviewCount ?? 0,
    trustScore: item.verificationStatus === "verified" ? 90 : 72,
    verified: item.verificationStatus === "verified",
    deliveryAvailable: firstService?.bookingType === "delivery",
    estimatedDeliveryTime: firstService?.bookingType === "delivery" ? "Varies" : "By appointment",
    availability: item.acceptsBookings ? "Bookings open" : "Unavailable",
    startingPrice: firstService?.price ?? firstService?.minPrice ?? 0,
    completedJobs: item.completedBookingCount ?? 0,
    responseTime: "Response time coming soon",
    serviceRadiusKm: Number(item.location?.serviceRadiusKm ?? item.serviceRadiusKm ?? 8),
    image: item.coverImageUrl || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    tagline: item.tagline ?? "",
    description: item.description ?? "",
    address: item.location?.address ?? `${item.area ?? "Ibadan"}, Ibadan`,
    hours: "Hours available on profile",
    phone: item.phone ?? "",
    trustBreakdown: { identityVerified: item.verificationStatus === "verified" ? 92 : 60, completedOrders: 80, responseRate: 75, repeatCustomers: 70 },
    deliveryOptions: firstService?.bookingType === "delivery" ? ["Delivery", "Pickup"] : ["Booking", "On-site service"]
  };
}

export function mapApiService(item: ApiService): Service {
  return {
    id: item.id,
    vendorId: item.businessId ?? item.business_id ?? "",
    name: item.name,
    description: item.description ?? "",
    price: item.price ?? item.minPrice ?? 0,
    fee: 0,
    duration: item.durationMinutes ? `${item.durationMinutes} min` : "Varies",
    image: item.imageUrl || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    type: item.bookingType === "delivery" ? "delivery" : "booking"
  };
}

export function mapApiBooking(item: ApiBooking): Order {
  const completed = item.status === "completed";
  return {
    id: item.id,
    vendorId: item.business.id,
    vendorImage: item.business.coverImageUrl,
    serviceId: item.service.id,
    status: completed ? "completed" : item.status === "on_the_way" ? "arriving" : item.status === "in_progress" ? "in-progress" : "confirmed",
    title: item.service.name,
    vendorName: item.business.name,
    serviceName: item.service.name,
    kind: item.service.bookingType === "delivery" ? "delivery" : "booking",
    date: `${item.requestedDate}, ${item.requestedTime}`,
    nextAction: completed ? "Leave review" : "Track booking",
    eta: completed ? "Completed" : "Pending update",
    deliveryArea: "Bodija",
    total: item.total,
    timeline: (item.timeline ?? []).map((step) => ({
      label: step.newStatus.replace(/_/g, " "),
      time: new Date(step.createdAt).toLocaleString(),
      completed: true
    }))
  };
}

export function mapApiReview(item: ApiReview): Review {
  return {
    id: item.id,
    vendorId: item.businessId ?? item.business_id ?? "",
    customerName: item.customerName ?? item.customer_name ?? "Hermes customer",
    rating: Number(item.rating),
    comment: item.comment ?? "",
    date: item.createdAt ?? item.created_at ?? "",
    serviceUsed: item.serviceUsed ?? item.service_used
  };
}
