import React from 'react';
import { View } from 'react-native';

export const SkeletonTaskItem = () => {
  return (
    <View className="p-4 mb-3 rounded-lg border bg-gray-100 border-gray-200">
      <View className="flex-row items-center">
        <View className="w-6 h-6 rounded-full bg-gray-300 mr-3" />
        <View className="flex-1">
          <View className="h-5 bg-gray-300 rounded mb-2 w-3/4" />
          <View className="h-3 bg-gray-300 rounded w-1/2" />
          <View className="flex-row items-center mt-2">
            <View className="h-4 bg-gray-300 rounded-full w-16" />
            <View className="h-3 bg-gray-300 rounded w-20 ml-2" />
          </View>
        </View>
      </View>
    </View>
  );
};
