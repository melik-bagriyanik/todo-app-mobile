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
          placeholderTextColor="#6B7280"
          className={`bg-gray-100 border-2 border-gray-300 rounded-2xl px-5 py-4 text-base text-gray-800 shadow-md focus:border-gray-400 focus:shadow-lg focus:bg-white transition-all duration-200 ${className}`}
          style={{
            paddingRight: (isLoading || (value.length > 0 && onClear)) ? 50 : 20,
          }}
        />
        {isLoading && (
          <View className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <ActivityIndicator size="small" color="#8B5CF6" />
          </View>
        )}
        {!isLoading && value.length > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-400 items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <Text className="text-white text-sm font-bold">×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
