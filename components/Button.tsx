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
      className={`${styles.button} ${touchableProps.className} ${loading ? 'opacity-75' : ''}`}>
      {loading ? (
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="white" className="mr-2" />
          <Text className={styles.buttonText}>{title}</Text>
        </View>
      ) : (
        <Text className={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

const styles = {
  button: 'items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
  buttonText: 'text-white text-lg font-semibold text-center',
};
