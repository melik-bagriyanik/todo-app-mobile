import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, loading = false, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      disabled={loading || touchableProps.disabled}
      className={`items-center bg-indigo-500 rounded-[28px] shadow-md p-4 ${touchableProps.className} ${loading ? 'opacity-75' : ''}`}>
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
