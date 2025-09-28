import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-50">
      <View className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <View className="items-center mb-6">
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
        </View>
        
        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
          Something went wrong
        </Text>
        
        <Text className="text-sm text-gray-600 text-center mb-6">
          An unexpected error occurred. Please try again or restart the app.
        </Text>

        {__DEV__ && error && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-xs text-red-800 font-mono">
              {error.message}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={resetError}
          className="bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ErrorBoundary;
