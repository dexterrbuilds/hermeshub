import * as Location from "expo-location";

export type UserLocation =
  | { status: "granted"; latitude: number; longitude: number }
  | { status: "denied" | "unavailable" };

export const locationService = {
  async getCurrentLocation(): Promise<UserLocation> {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") return { status: "denied" };
    const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return {
      status: "granted",
      latitude: current.coords.latitude,
      longitude: current.coords.longitude
    };
  }
};
