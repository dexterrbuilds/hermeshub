import * as Haptics from "expo-haptics";

export async function selectionFeedback() {
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics are best-effort and should never block UI interactions.
  }
}

export async function successFeedback() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics are best-effort and should never block UI interactions.
  }
}

export async function impactFeedback() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics are best-effort and should never block UI interactions.
  }
}
