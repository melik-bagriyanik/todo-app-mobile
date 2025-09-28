/**
 * Toast Notification Utilities
 * Provides consistent toast notifications across the application
 */
import Toast from 'react-native-toast-message';

// ==================== BASIC TOAST FUNCTIONS ====================

/**
 * Basic toast notification functions for different types
 */
export const showToast = {
  /** Shows a success toast notification */
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  },
  /** Shows an error toast notification */
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  },
  /** Shows an info toast notification */
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  },
};

// ==================== SEMANTIC TOAST MESSAGES ====================

/**
 * Predefined toast messages for common application actions
 * Provides consistent messaging across the application
 */
export const toastMessages = {
  /** List management toasts */
  listCreated: () => showToast.success('List Created', 'Your list has been created successfully!'),
  listDeleted: () => showToast.success('List Deleted', 'List has been deleted successfully!'),
  
  /** Task management toasts */
  taskCreated: () => showToast.success('Task Created', 'Your task has been created successfully!'),
  taskUpdated: () => showToast.success('Task Updated', 'Your task has been updated successfully!'),
  taskDeleted: () => showToast.success('Task Deleted', 'Task has been deleted successfully!'),
  taskCompleted: () => showToast.success('Task Completed', 'Great job!'),
  
  /** Error toasts */
  error: (message: string) => showToast.error('Error', message),
  networkError: () => showToast.error('Network Error', 'Please check your internet connection'),
};
