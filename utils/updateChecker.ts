import * as Application from "expo-application";
import { Alert, Linking, Platform } from "react-native";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.marufhasan.rebati";

const LATEST_VERSION = "1.0.4";

export const checkForUpdate = () => {
  if (Platform.OS !== "android") {
    return;
  }

  const currentVersion = Application.nativeApplicationVersion;

  console.log("Installed Version:", currentVersion);
  console.log("Latest Version:", LATEST_VERSION);

  if (currentVersion && compareVersions(currentVersion, LATEST_VERSION) < 0) {
    Alert.alert(
      "Update Available",
      "A new version of Rebati is available. Please update now.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: openPlayStore,
        },
      ],
    );
  }
};

const openPlayStore = async () => {
  try {
    await Linking.openURL(PLAY_STORE_URL);
  } catch (error) {
    console.log("Play Store open error:", error);
  }
};

const compareVersions = (current: string, latest: string) => {
  const currentParts = current.split(".").map(Number);
  const latestParts = latest.split(".").map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentNum = currentParts[i] || 0;
    const latestNum = latestParts[i] || 0;

    if (latestNum > currentNum) {
      return -1;
    }

    if (latestNum < currentNum) {
      return 1;
    }
  }

  return 0;
};
