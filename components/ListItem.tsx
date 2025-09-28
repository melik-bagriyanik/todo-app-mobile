import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { List } from '@/types';

interface ListItemProps {
  list: List;
  onPress: (list: List) => void;
  onDelete: (list: List) => void;
  isDeleting?: boolean;
}

export const ListItem = ({ list, onPress, onDelete, isDeleting = false }: ListItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => !isDeleting && onPress(list)}
      disabled={isDeleting}
      className={`p-4 mb-3 rounded-2xl shadow-sm border border-gray-200 ${
        isDeleting ? 'bg-gray-100 opacity-75' : 'bg-white'
      } active:scale-98 transition-transform`}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{list.name}</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Created: {new Date(list.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity
          onPress={() => {
            !isDeleting && onDelete(list);
          }}
          disabled={isDeleting}
          className={`px-6 py-3 rounded-xl border-2 ${
            isDeleting 
              ? 'bg-gray-400 border-gray-400' 
              : 'bg-red-500 border-red-500 shadow-lg shadow-red-500/30'
          } active:scale-95 transition-all duration-200`}
        >
          <Text className={`font-semibold text-sm ${
            isDeleting ? 'text-gray-600' : 'text-white'
          }`}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
