export type CategoryId =
  | "beauty"
  | "food"
  | "home"
  | "repairs"
  | "fashion"
  | "events"
  | "cleaning"
  | "tech"
  | "wellness"
  | "learning"
  | "automotive"
  | "more";

export type Category = {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  subcategories?: string[];
};

export type IbadanArea =
  | "Bodija"
  | "Akobo"
  | "Challenge"
  | "Ring Road"
  | "UI"
  | "Dugbe"
  | "Mokola"
  | "Eleyele"
  | "Jericho"
  | "Samonda";

export type Service = {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  fee?: number;
  duration: string;
  image: string;
  type: "booking" | "delivery";
};

export type Review = {
  id: string;
  vendorId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceUsed?: string;
};

export type Vendor = {
  id: string;
  businessName: string;
  categoryId: CategoryId;
  category: string;
  area: IbadanArea;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  trustScore: number;
  verified: boolean;
  deliveryAvailable: boolean;
  estimatedDeliveryTime: string;
  availability: string;
  startingPrice: number;
  completedJobs: number;
  responseTime: string;
  serviceRadiusKm: number;
  saved?: boolean;
  image: string;
  tagline: string;
  description: string;
  address: string;
  hours: string;
  phone: string;
  trustBreakdown: {
    identityVerified: number;
    completedOrders: number;
    responseRate: number;
    repeatCustomers: number;
  };
  deliveryOptions: string[];
};

export type OrderStatus = "requested" | "confirmed" | "in-progress" | "arriving" | "completed";

export type Order = {
  id: string;
  vendorId: string;
  vendorImage?: string;
  serviceId: string;
  status: OrderStatus;
  title: string;
  vendorName: string;
  serviceName: string;
  kind: "booking" | "delivery";
  date: string;
  nextAction: string;
  eta: string;
  deliveryArea: IbadanArea;
  total: number;
  timeline: {
    label: string;
    time: string;
    completed: boolean;
  }[];
};

export type WalletTransaction = {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
};
