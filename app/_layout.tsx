import '../global.css';

import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import DatabaseProvider from '@/providers/database-provider';

export default function Layout() {
  return (
    <DatabaseProvider>
      <Stack />
      <Toast />
    </DatabaseProvider>
  );
}
