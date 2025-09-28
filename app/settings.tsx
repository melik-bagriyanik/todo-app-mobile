import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Container } from '@/components/Container';
import { usePreferencesStore } from '@/store/store';

export default function SettingsScreen() {
  const {
    theme,
    defaultListSort,
    defaultTaskSort,
    defaultTaskPriority,
    defaultTaskStatus,
    showCompletedTasks,
    showTaskDescriptions,
    compactView,
    enableNotifications,
    reminderTime,
    setTheme,
    setDefaultListSort,
    setDefaultTaskSort,
    setDefaultTaskPriority,
    setDefaultTaskStatus,
    setShowCompletedTasks,
    setShowTaskDescriptions,
    setCompactView,
    setEnableNotifications,
    setReminderTime,
    resetPreferences,
  } = usePreferencesStore();

  const handleResetPreferences = () => {
    Alert.alert(
      'Reset Preferences',
      'Are you sure you want to reset all preferences to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetPreferences,
        },
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    children 
  }: { 
    title: string; 
    subtitle?: string; 
    children: React.ReactNode; 
  }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-800 mb-1">{title}</Text>
      {subtitle && <Text className="text-sm text-gray-500 mb-3">{subtitle}</Text>}
      {children}
    </View>
  );

  return (
    <Container>
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Theme Settings */}
          <SettingItem 
            title="Theme" 
            subtitle="Choose your preferred theme"
          >
            <View className="flex-row">
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  onPress={() => setTheme(themeOption)}
                  className={`px-4 py-2 rounded-lg mr-2 border ${
                    theme === themeOption
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`font-medium ${
                    theme === themeOption ? 'text-white' : 'text-gray-700'
                  }`}>
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingItem>

          {/* Default Sort Settings */}
          <SettingItem 
            title="Default List Sort" 
            subtitle="How lists are sorted by default"
          >
            <View className="flex-row flex-wrap">
              {(['name', 'created_at', 'updated_at'] as const).map((sortOption) => (
                <TouchableOpacity
                  key={sortOption}
                  onPress={() => setDefaultListSort(sortOption)}
                  className={`px-3 py-2 rounded-lg mr-2 mb-2 border ${
                    defaultListSort === sortOption
                      ? 'bg-green-500 border-green-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    defaultListSort === sortOption ? 'text-white' : 'text-gray-700'
                  }`}>
                    {sortOption === 'created_at' ? 'Created Date' : 
                     sortOption === 'updated_at' ? 'Updated Date' : 'Name'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingItem>

          <SettingItem 
            title="Default Task Sort" 
            subtitle="How tasks are sorted by default"
          >
            <View className="flex-row flex-wrap">
              {(['name', 'created_at', 'updated_at', 'priority', 'due_date'] as const).map((sortOption) => (
                <TouchableOpacity
                  key={sortOption}
                  onPress={() => setDefaultTaskSort(sortOption)}
                  className={`px-3 py-2 rounded-lg mr-2 mb-2 border ${
                    defaultTaskSort === sortOption
                      ? 'bg-green-500 border-green-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    defaultTaskSort === sortOption ? 'text-white' : 'text-gray-700'
                  }`}>
                    {sortOption === 'created_at' ? 'Created Date' : 
                     sortOption === 'updated_at' ? 'Updated Date' : 
                     sortOption === 'due_date' ? 'Due Date' : 
                     sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingItem>

          {/* Default Task Settings */}
          <SettingItem 
            title="Default Task Priority" 
            subtitle="Default priority for new tasks"
          >
            <View className="flex-row">
              {(['low', 'medium', 'high'] as const).map((priority) => {
                const getPriorityColor = (priority: string, isSelected: boolean) => {
                  if (isSelected) {
                    switch (priority) {
                      case 'high': return 'bg-red-500 border-red-500';
                      case 'medium': return 'bg-yellow-500 border-yellow-500';
                      case 'low': return 'bg-green-500 border-green-500';
                      default: return 'bg-gray-500 border-gray-500';
                    }
                  }
                  return 'bg-gray-100 border-gray-300';
                };

                return (
                  <TouchableOpacity
                    key={priority}
                    onPress={() => setDefaultTaskPriority(priority)}
                    className={`px-4 py-2 rounded-lg mr-2 border ${getPriorityColor(priority, defaultTaskPriority === priority)}`}
                  >
                    <Text className={`font-medium ${
                      defaultTaskPriority === priority ? 'text-white' : 'text-gray-700'
                    }`}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SettingItem>

          <SettingItem 
            title="Default Task Status" 
            subtitle="Default status for new tasks"
          >
            <View className="flex-row flex-wrap">
              {(['pending', 'in_progress', 'completed'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setDefaultTaskStatus(status)}
                  className={`px-3 py-2 rounded-lg mr-2 mb-2 border ${
                    defaultTaskStatus === status
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    defaultTaskStatus === status ? 'text-white' : 'text-gray-700'
                  }`}>
                    {status === 'in_progress' ? 'In Progress' : 
                     status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </SettingItem>

          {/* Display Settings */}
          <SettingItem 
            title="Display Options"
          >
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">Show Completed Tasks</Text>
                  <Text className="text-sm text-gray-500">Display completed tasks in lists</Text>
                </View>
                <Switch
                  value={showCompletedTasks}
                  onValueChange={setShowCompletedTasks}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor={showCompletedTasks ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">Show Task Descriptions</Text>
                  <Text className="text-sm text-gray-500">Display task descriptions in task list</Text>
                </View>
                <Switch
                  value={showTaskDescriptions}
                  onValueChange={setShowTaskDescriptions}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor={showTaskDescriptions ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">Compact View</Text>
                  <Text className="text-sm text-gray-500">Use compact layout for better space usage</Text>
                </View>
                <Switch
                  value={compactView}
                  onValueChange={setCompactView}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor={compactView ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          </SettingItem>

          {/* Notification Settings */}
          <SettingItem 
            title="Notifications"
          >
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">Enable Notifications</Text>
                  <Text className="text-sm text-gray-500">Receive notifications for task reminders</Text>
                </View>
                <Switch
                  value={enableNotifications}
                  onValueChange={setEnableNotifications}
                  trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                  thumbColor={enableNotifications ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>

              {enableNotifications && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800">Reminder Time</Text>
                    <Text className="text-sm text-gray-500">Minutes before due date</Text>
                  </View>
                  <View className="flex-row">
                    {[15, 30, 60, 120].map((minutes) => (
                      <TouchableOpacity
                        key={minutes}
                        onPress={() => setReminderTime(minutes)}
                        className={`px-3 py-2 rounded-lg mr-2 border ${
                          reminderTime === minutes
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          reminderTime === minutes ? 'text-white' : 'text-gray-700'
                        }`}>
                          {minutes}m
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </SettingItem>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPreferences}
            className="bg-red-500 p-4 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold text-center text-lg">
              Reset All Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
