import React from 'react';
import { View, Text, TextInput, Modal } from 'react-native';
import { Button } from './Button';

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  onChangeText: (text: string) => void;
  isLoading?: boolean;
  title?: string;
  placeholder?: string;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  visible,
  onClose,
  onSubmit,
  value,
  onChangeText,
  isLoading = false,
  title = 'Create New List',
  placeholder = 'Enter list name',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12 max-w-sm">
          <Text className="text-xl font-bold mb-4 text-center">{title}</Text>
          
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
            autoFocus
          />
          
          <View className="flex-row">
            <Button
              title="Cancel"
              onPress={onClose}
              className="flex-1 bg-gray-500 mr-3"
            />
            <Button
              title="Create"
              onPress={onSubmit}
              loading={isLoading}
              className="flex-1 bg-green-500"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
