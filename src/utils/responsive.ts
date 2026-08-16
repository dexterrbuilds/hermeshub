import { Platform, useWindowDimensions } from "react-native";

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440
};

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isTablet = width >= breakpoints.tablet;
  const isDesktop = isWeb && width >= breakpoints.desktop;
  const isLargeDesktop = isWeb && width >= breakpoints.largeDesktop;
  const gutter = isLargeDesktop ? 64 : isDesktop ? 48 : isTablet ? 32 : 20;
  const maxContentWidth = isLargeDesktop ? 1320 : isDesktop ? 1200 : 900;

  return {
    width,
    height,
    isWeb,
    isTablet,
    isDesktop,
    isLargeDesktop,
    gutter,
    maxContentWidth,
    vendorColumns: isLargeDesktop ? 4 : isDesktop ? 3 : isTablet ? 2 : 1
  };
}
