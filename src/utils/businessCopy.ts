import { Vendor } from "@/types/marketplace";
import { formatCurrency } from "@/utils/format";

export function getBusinessCardCopy(vendor: Vendor) {
  const category = vendor.category.toLowerCase();
  const name = vendor.businessName.toLowerCase();

  if (category.includes("barber") || name.includes("fade")) {
    return {
      priceLine: `Cuts from ${formatCurrency(vendor.startingPrice)}`,
      availabilityLine: vendor.availability.includes("Open") ? "Open until 8 PM" : vendor.availability
    };
  }

  if (category.includes("bakery") || name.includes("cakes")) {
    return {
      priceLine: `Custom cakes from ${formatCurrency(Math.max(vendor.startingPrice, 18000))}`,
      availabilityLine: "Order 24h ahead"
    };
  }

  if (category.includes("repair") || category.includes("device")) {
    return {
      priceLine: `Repairs from ${formatCurrency(vendor.startingPrice)}`,
      availabilityLine: vendor.availability
    };
  }

  if (category.includes("makeup")) {
    return {
      priceLine: `Bookings from ${formatCurrency(vendor.startingPrice)}`,
      availabilityLine: vendor.availability
    };
  }

  if (category.includes("photography")) {
    return {
      priceLine: `Shoots from ${formatCurrency(vendor.startingPrice)}`,
      availabilityLine: vendor.availability
    };
  }

  if (category.includes("laundry")) {
    return {
      priceLine: `Laundry from ${formatCurrency(vendor.startingPrice)}`,
      availabilityLine: vendor.availability
    };
  }

  if (category.includes("chef") || category.includes("food")) {
    return {
      priceLine: `Orders from ${formatCurrency(vendor.startingPrice)}`,
      availabilityLine: vendor.availability
    };
  }

  return {
    priceLine: `From ${formatCurrency(vendor.startingPrice)}`,
    availabilityLine: vendor.availability
  };
}
