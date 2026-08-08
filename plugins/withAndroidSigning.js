const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Add release keystore
    if (!contents.includes("rebati-upload-key.keystore")) {
      contents = contents.replace(
        "signingConfigs {",
        `
        signingConfigs {
            release {
                storeFile file('../../rebati-upload-key.keystore')
                storePassword "12345678"
                keyAlias "rebati-key-alias"
                keyPassword "12345678"
            }
        `,
      );
    }

    // Fix only release buildType
    contents = contents.replace(
      /release\s*\{\s*\/\/ Caution! In production, you need to generate your own keystore file\.\s*\/\/ see https:\/\/reactnative\.dev\/docs\/signed-apk-android\.\s*signingConfig signingConfigs\.debug/,
      `release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.release`,
    );

    config.modResults.contents = contents;

    return config;
  });
};
