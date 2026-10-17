import * as Application from "expo-application";
import { Alert, Linking, Platform } from "react-native";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.marufhasan.rebati";

// Play Store latest version
const PLAY_STORE_VERSION = "1.0.5";

export const checkForUpdate = () => {
  if (Platform.OS !== "android") {
    return;
  }

  const installedVersion = Application.nativeApplicationVersion;

  console.log("Installed:", installedVersion);

  console.log("Play Store:", PLAY_STORE_VERSION);

  if (
    installedVersion &&
    compareVersions(installedVersion, PLAY_STORE_VERSION) < 0
  ) {
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
    console.log(error);
  }
};

const compareVersions = (current: string, latest: string) => {
  const currentParts = current.split(".").map(Number);

  const latestParts = latest.split(".").map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentNumber = currentParts[i] || 0;

    const latestNumber = latestParts[i] || 0;

    if (latestNumber > currentNumber) {
      return -1;
    }

    if (latestNumber < currentNumber) {
      return 1;
    }
  }

  return 0;
};
