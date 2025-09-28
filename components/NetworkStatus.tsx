import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

interface NetworkStatusProps {
  onRetry?: () => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      
      if (connected !== isConnected) {
        setIsConnected(connected);
        
        if (!connected) {
          setIsVisible(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else if (isVisible) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setIsVisible(false));
        }
      }
    });

    return () => unsubscribe();
  }, [isConnected, isVisible, fadeAnim]);

  // Temporarily disable network status
  return null;

  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
          }),
        }],
      }}
      className="absolute top-0 left-0 right-0 z-50 bg-red-500 p-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons name="wifi-outline" size={20} color="white" />
          <Text className="text-white font-medium ml-2 flex-1">
            No internet connection
          </Text>
        </View>
        
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-white/20 px-3 py-1 rounded-full"
          >
            <Text className="text-white text-sm font-medium">
              Retry
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};
