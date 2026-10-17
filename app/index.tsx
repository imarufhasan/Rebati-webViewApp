import NetInfo from "@react-native-community/netinfo";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";

const SITE_URL = "https://rebati.com.bd/";

export default function Index() {
  const webViewRef = useRef<WebView>(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }

        return false;
      },
    );

    return () => backHandler.remove();
  }, [canGoBack]);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected));
    });

    return unsubscribe;
  }, []);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack);
    },
    [],
  );

  const handleReload = () => {
    setHasError(false);
    setLoading(true);

    webViewRef.current?.reload();
  };

  const handleError = (event: any) => {
    console.log("WebView Error:", event.nativeEvent);

    setLoading(false);
    setHasError(true);
  };


  if (!isConnected) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ExpoStatusBar style="dark" />

        <Text style={styles.errorTitle}>No Internet Connection</Text>

        <Text style={styles.errorSubtitle}>
          Please check your internet connection.
        </Text>

        <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ExpoStatusBar style="dark" />

        <Text style={styles.errorTitle}>Something Went Wrong</Text>

        <Text style={styles.errorSubtitle}>Unable to load page.</Text>

        <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />

      <WebView
        ref={webViewRef}
        source={{
          uri: SITE_URL,
        }}
        style={styles.webview}

        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"

        javaScriptEnabled={true}
        domStorageEnabled={true}

        androidLayerType="hardware"
        mixedContentMode="always"

        originWhitelist={["*"]}
        onNavigationStateChange={handleNavigationStateChange}

        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onError={handleError}
        onHttpError={() => {
          setLoading(false);
          setHasError(true);
        }}

        userAgent={
          "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome Mobile Safari/537.36"
        }

        allowsBackForwardNavigationGestures={true}
        pullToRefreshEnabled={true}

        setSupportMultipleWindows={false}
      />

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",

    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  webview: {
    flex: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#ffffff",
  },

  centerContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 30,

    backgroundColor: "#fff",
  },

  errorTitle: {
    fontSize: 18,

    fontWeight: "700",

    color: "#333",

    marginBottom: 10,

    textAlign: "center",
  },

  errorSubtitle: {
    fontSize: 14,

    color: "#666",

    marginBottom: 20,

    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#0a7ea4",

    paddingHorizontal: 25,

    paddingVertical: 12,

    borderRadius: 8,
  },

  retryButtonText: {
    color: "#fff",

    fontSize: 15,

    fontWeight: "600",
  },
});
