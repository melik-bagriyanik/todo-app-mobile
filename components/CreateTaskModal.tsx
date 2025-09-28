/**
 * CreateTaskModal - Modal component for creating new tasks
 * Features: Form validation, priority selection, due date input
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from './Button';
import { Priority } from '@/types';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => void;
  isLoading?: boolean;
  title?: string;
}

interface TaskFormData {
  name: string;
  description: string;
  priority: Priority;
  due_date?: string;
  status: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
  title = 'Create New Task',
}) => {
  //  STATE MANAGEMENT 
  
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');

  //  EFFECTS 
  
  /**
   * Reset form when modal opens
   */
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  //  HELPER FUNCTIONS 
  
  /**
   * Resets all form fields to default values
   */
  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setPriority('medium');
    setDueDate('');
    setStatus('pending');
  };

  /**
   * Validates due date format
   */
  const validateDueDate = (date: string): boolean => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  //  EVENT HANDLERS 
  
  /**
   * Handles form submission with validation
   */
  const handleSubmit = () => {
    // Validate due date format if provided
    if (!validateDueDate(dueDate)) {
      alert('Due date must be in YYYY-MM-DD format (e.g., 2024-12-31)');
      return;
    }

    const taskData: TaskFormData = {
      name: taskName.trim(),
      description: taskDescription.trim(),
      priority,
      due_date: dueDate || undefined,
      status,
    };
    onSubmit(taskData);
  };

  /**
   * Handles modal close and form reset
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * Returns the appropriate color class for priority
   */
  const getPriorityColor = (p: Priority): string => {
    const colorMap = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colorMap[p] || 'bg-gray-500';
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-11/12 max-w-md max-h-[90%]">
          <Text className="text-xl font-bold mb-4 text-center">{title}</Text>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Task Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Task Name *</Text>
              <TextInput
                value={taskName}
                onChangeText={setTaskName}
                placeholder="Enter task name"
                placeholderTextColor="#9CA3AF"
                className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 shadow-sm focus:border-blue-500 focus:shadow-md"
                autoFocus
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
              <TextInput
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="Enter description (optional)"
                placeholderTextColor="#9CA3AF"
                className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 shadow-sm focus:border-blue-500 focus:shadow-md"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Priority Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Priority</Text>
              <View className="flex-row flex-wrap">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
                      priority === p 
                        ? `${getPriorityColor(p)} border-transparent` 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      priority === p ? 'text-white' : 'text-gray-700'
                    }`}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>


            {/* Due Date */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Due Date</Text>
              <TextInput
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD (optional)"
                placeholderTextColor="#9CA3AF"
                className={`bg-white border-2 rounded-xl px-4 py-3 text-base text-gray-800 shadow-sm focus:shadow-md ${
                  dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) && (
                <Text className="text-red-500 text-xs mt-1">
                  Please enter date in YYYY-MM-DD format (e.g., 2024-12-31)
                </Text>
              )}
            </View>
          </ScrollView>
          
          <View className="flex-row">
            <Button
              title="Cancel"
              onPress={handleClose}
              className="flex-1 bg-gray-500 mr-3"
            />
            <Button
              title="Create"
              onPress={handleSubmit}
              loading={isLoading}
              className="flex-1 bg-blue-500"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
