/**
 * Common TypeScript types and interfaces
 */

export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  query: string;
  limit?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  status?: TaskStatus;
  priority?: Priority;
  list_id?: number;
  due_date?: string;
}

export interface ListItemProps<T> {
  item: T;
  onPress: (item: T) => void;
  onDelete: (item: T) => void;
  isDeleting?: boolean;
  isProcessing?: boolean;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AsyncWrapperProps {
  loading: boolean;
  error: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
}
