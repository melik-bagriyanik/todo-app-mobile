import '../global.css';

import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import DatabaseProvider from '@/providers/database-provider';
import QueryProvider from '@/providers/query-provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { NetworkStatus } from '@/components/NetworkStatus';

export default function Layout() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <DatabaseProvider>
          <NetworkStatus />
          <Stack />
          <Toast />
        </DatabaseProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
