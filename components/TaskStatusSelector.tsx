/**
 * TaskStatusSelector - Dropdown component for selecting task status
 * Features: Modal dropdown, visual indicators, loading states
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskStatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

// ==================== CONSTANTS ====================

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-500', icon: 'time-outline' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500', icon: 'play-outline' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500', icon: 'checkmark-circle-outline' },
];

export const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
  isLoading = false,
}) => {
  // ==================== STATE MANAGEMENT ====================
  
  const [isOpen, setIsOpen] = useState(false);

  // ==================== COMPUTED VALUES ====================
  
  const currentOption = statusOptions.find(option => option.value === currentStatus) || statusOptions[0];

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handles status selection and closes modal
   */
  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && !isLoading && setIsOpen(true)}
        disabled={disabled || isLoading}
        className={`flex-row items-center px-3 py-2 rounded-xl border ${
          disabled || isLoading ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-300 shadow-sm'
        } active:scale-95 transition-transform`}
        activeOpacity={0.7}
      >
        <View className={`w-2 h-2 rounded-full mr-1 ${currentOption.color}`} />
        {isLoading ? (
          <ActivityIndicator size="small" color="#6B7280" style={{ marginRight: 4 }} />
        ) : (
          <Text className={`text-xs font-medium ${
            disabled || isLoading ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {currentOption.label}
          </Text>
        )}
        <Ionicons 
          name="chevron-down" 
          size={12} 
          color={disabled || isLoading ? '#9CA3AF' : '#6B7280'} 
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-white rounded-2xl w-64 shadow-2xl border border-gray-100">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">Select Status</Text>
            </View>
            
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleStatusSelect(option.value)}
                className={`flex-row items-center px-4 py-3 ${
                  currentStatus === option.value ? 'bg-blue-50' : ''
                } active:bg-gray-50 transition-colors`}
                activeOpacity={0.7}
              >
                <View className={`w-4 h-4 rounded-full mr-3 ${option.color}`} />
                <Ionicons 
                  name={option.icon as any} 
                  size={20} 
                  color="#6B7280" 
                  style={{ marginRight: 12 }}
                />
                <Text className={`text-base ${
                  currentStatus === option.value ? 'font-semibold text-gray-800' : 'text-gray-700'
                }`}>
                  {option.label}
                </Text>
                {currentStatus === option.value && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color="#10B981" 
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
