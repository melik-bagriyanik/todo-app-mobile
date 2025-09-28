/**
 * Button - Reusable button component with loading states and customizable styles
 * Features: Loading indicator, haptic feedback, customizable colors
 */
import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, loading = false, ...touchableProps }, ref) => {
  /**
   * Determines button styles based on className
   */
  const getButtonStyles = (): string => {
    const className = touchableProps.className || '';
    
    const styleMap = {
      'bg-[#292929]': 'bg-[#292929] shadow-lg',
      'bg-green-500': 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-green-500/25',
      'bg-blue-500': 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25',
      'bg-red-500': 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/25',
      'bg-gray-500': 'bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg shadow-gray-500/25',
    };
    
    // Find matching style or use default
    const matchedStyle = Object.entries(styleMap).find(([key]) => className.includes(key));
    return matchedStyle ? matchedStyle[1] : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25';
  };

  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      disabled={loading || touchableProps.disabled}
      className={`items-center ${getButtonStyles()} rounded-2xl p-4 ${touchableProps.className} ${loading ? 'opacity-75' : ''} active:scale-95 transition-transform`}>
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="white" className="mr-2" />
          <Text className="text-white text-lg font-semibold text-center">{title}</Text>
        </View>
      ) : (
        <Text className="text-white text-lg font-semibold text-center">{title}</Text>
      )}
    </TouchableOpacity>
  );
});
