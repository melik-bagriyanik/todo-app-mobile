import React from 'react';
import { View, Text, TextInput, Modal } from 'react-native';
import { Button } from './Button';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  taskName: string;
  taskDescription: string;
  onTaskNameChange: (text: string) => void;
  onTaskDescriptionChange: (text: string) => void;
  isLoading?: boolean;
  title?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
  taskName,
  taskDescription,
  onTaskNameChange,
  onTaskDescriptionChange,
  isLoading = false,
  title = 'Create New Task',
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
            value={taskName}
            onChangeText={onTaskNameChange}
            placeholder="Enter task name"
            placeholderTextColor="#9CA3AF"
            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-3 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
            autoFocus
          />
          
          <TextInput
            value={taskDescription}
            onChangeText={onTaskDescriptionChange}
            placeholder="Enter description (optional)"
            placeholderTextColor="#9CA3AF"
            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
            multiline
            numberOfLines={3}
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
              className="flex-1 bg-blue-500"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
