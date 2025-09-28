// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query Types
export interface QueryParams {
  search?: string;
  filter?: Record<string, any>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: PaginationParams;
}

// Mutation Types
export interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
}

// Async State Types
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  testID?: string;
}

export interface LoadingProps {
  loading?: boolean;
  loadingMessage?: string;
}

export interface ErrorProps {
  error?: ApiError | null;
  onRetry?: () => void;
  errorMessage?: string;
}

// Form Types
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormFieldProps<T> {
  name: keyof T;
  value: T[keyof T];
  onChange: (value: T[keyof T]) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

// Navigation Types
export interface NavigationParams {
  listId?: string;
  listName?: string;
  taskId?: string;
  taskName?: string;
}

// Store Types
export interface StoreState {
  ui: UIState;
  data: DataState;
}

export interface UIState {
  modals: ModalState;
  loading: LoadingState;
  selected: SelectedState;
}

export interface DataState {
  cache: Record<string, any>;
  lastUpdated: Record<string, number>;
}

export interface ModalState {
  createList: boolean;
  createTask: boolean;
  editList: boolean;
  editTask: boolean;
}

export interface LoadingState {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  fetching: boolean;
}

export interface SelectedState {
  listId: number | null;
  taskId: number | null;
}
