import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  isLoading = false,
  onClear,
  className = '',
}) => {
  return (
    <View className="mb-4">
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className={`bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md ${className}`}
          style={{
            paddingRight: isLoading ? 40 : 16,
          }}
        />
        {isLoading && (
          <View className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ActivityIndicator size="small" color="#10b981" />
          </View>
        )}
        {!isLoading && value.length > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300 items-center justify-center"
          >
            <Text className="text-gray-600 text-xs font-bold">×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
