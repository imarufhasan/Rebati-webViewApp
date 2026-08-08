import { Platform } from "react-native";

export const checkForUpdate = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    const InAppUpdates = require("react-native-in-app-updates").default;

    const inAppUpdates = new InAppUpdates(false);

    const result = await inAppUpdates.checkNeedsUpdate();

    console.log("Update result:", result);

    if (result.shouldUpdate) {
      await inAppUpdates.startUpdate({
        updateType: "flexible",
      });
    }
  } catch (error) {
    console.log("Update check error:", error);
  }
};
