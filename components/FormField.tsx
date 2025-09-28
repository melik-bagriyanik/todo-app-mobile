import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onBlur?: () => void;
  onFocus?: () => void;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  touched,
  required = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  onBlur,
  onFocus,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  testID,
}) => {
  const hasError = touched && error;
  const showRequired = required && !value;

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">
          {label}
        </Text>
        {required && (
          <Text className="text-red-500 ml-1">*</Text>
        )}
        {showRequired && (
          <Text className="text-red-500 text-xs ml-2">Required</Text>
        )}
      </View>

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Ionicons 
              name={leftIcon} 
              size={20} 
              color={hasError ? '#EF4444' : '#6B7280'} 
            />
          </View>
        )}

        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onBlur={onBlur}
          onFocus={onFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          className={`
            border rounded-lg px-3 py-3 text-base
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${hasError 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white'
            }
            ${disabled ? 'bg-gray-100 text-gray-500' : 'text-gray-900'}
            ${multiline ? 'min-h-[80px]' : 'h-12'}
          `}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
            disabled={!onRightIconPress}
          >
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={hasError ? '#EF4444' : '#6B7280'} 
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <Text className="text-red-500 text-xs mt-1">
          {error}
        </Text>
      )}

      {maxLength && (
        <Text className="text-gray-500 text-xs mt-1 text-right">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};
