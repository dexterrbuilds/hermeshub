export const mockDelay = async (min = 360, max = 680) =>
  new Promise((resolve) => setTimeout(resolve, Math.round(min + Math.random() * (max - min))));
