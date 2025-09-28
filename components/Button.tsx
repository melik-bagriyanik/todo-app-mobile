import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, loading = false, ...touchableProps }, ref) => {
  // Extract color from className or use default
  const getButtonStyles = () => {
    if (touchableProps.className?.includes('bg-[#292929]')) {
      return 'bg-[#292929] shadow-lg';
    }
    if (touchableProps.className?.includes('bg-green-500')) {
      return 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-green-500/25';
    }
    if (touchableProps.className?.includes('bg-blue-500')) {
      return 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25';
    }
    if (touchableProps.className?.includes('bg-red-500')) {
      return 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/25';
    }
    if (touchableProps.className?.includes('bg-gray-500')) {
      return 'bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg shadow-gray-500/25';
    }
    // Default modern gradient
    return 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25';
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
