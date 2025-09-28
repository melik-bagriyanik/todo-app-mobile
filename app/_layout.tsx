import '../global.css';

import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import DatabaseProvider from '@/providers/database-provider';
import QueryProvider from '@/providers/query-provider';

export default function Layout() {
  return (
    <QueryProvider>
      <DatabaseProvider>
        <Stack />
        <Toast />
      </DatabaseProvider>
    </QueryProvider>
  );
}
