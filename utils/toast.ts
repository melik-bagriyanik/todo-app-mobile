/**
 * Toast notification utility functions
 */
import Toast from 'react-native-toast-message';

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  },
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  },
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  },
};

export const toastMessages = {
  listCreated: () => showToast.success('List Created', 'Your list has been created successfully!'),
  listDeleted: () => showToast.success('List Deleted', 'List has been deleted successfully!'),
  taskCreated: () => showToast.success('Task Created', 'Your task has been created successfully!'),
  taskUpdated: () => showToast.success('Task Updated', 'Your task has been updated successfully!'),
  taskDeleted: () => showToast.success('Task Deleted', 'Task has been deleted successfully!'),
  taskCompleted: () => showToast.success('Task Completed', 'Great job!'),
  error: (message: string) => showToast.error('Error', message),
  networkError: () => showToast.error('Network Error', 'Please check your internet connection'),
};
