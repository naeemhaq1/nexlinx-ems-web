import React, { useState, useRef } from 'react';
import { View, StatusBar, Alert, BackHandler, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);

  const handleLoad = () => {
    setIsLoading(false);
    SplashScreen.hideAsync();
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Unable to connect to Nexlinx EMS. Please check your internet connection.',
      [{ text: 'Retry', onPress: () => webViewRef.current?.reload() }]
    );
  };

  const onNavigationStateChange = (navState) => {
    // Handle navigation if needed
    console.log('Navigation state changed:', navState.url);
  };

  // Handle Android back button
  React.useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1B3E' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1B3E" />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://nex-ems.replit.app' }}
        style={{ flex: 1 }}
        onLoad={handleLoad}
        onError={handleError}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        userAgent="NexlinxEMS/1.0 (Mobile App)"
        pullToRefreshEnabled={true}
        bounces={false}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        cacheEnabled={true}
        incognito={false}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        onShouldStartLoadWithRequest={(request) => {
          // Allow all navigation within the EMS domain
          return request.url.includes('nex-ems.replit.app') || 
                 request.url.includes('nexlinx') ||
                 request.url.startsWith('https://nex-ems.replit.app');
        }}
        renderError={(errorName) => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1B3E' }}>
            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', padding: 20 }}>
              Unable to load Nexlinx EMS{'\n'}{'\n'}
              Please check your internet connection and try again.
            </Text>
          </View>
        )}
      />
    </View>
  );
}