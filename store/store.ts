import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UI State Store
export interface UIState {
  // Modal states
  isCreateListModalOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isEditListModalOpen: boolean;
  isEditTaskModalOpen: boolean;
  
  // Loading states
  isCreatingList: boolean;
  isCreatingTask: boolean;
  isUpdatingList: boolean;
  isUpdatingTask: boolean;
  isDeletingList: boolean;
  isDeletingTask: boolean;
  
  // Selected items
  selectedListId: number | null;
  selectedTaskId: number | null;
  
  // Actions
  openCreateListModal: () => void;
  closeCreateListModal: () => void;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;
  openEditListModal: (listId: number) => void;
  closeEditListModal: () => void;
  openEditTaskModal: (taskId: number) => void;
  closeEditTaskModal: () => void;
  
  setCreatingList: (loading: boolean) => void;
  setCreatingTask: (loading: boolean) => void;
  setUpdatingList: (loading: boolean) => void;
  setUpdatingTask: (loading: boolean) => void;
  setDeletingList: (loading: boolean) => void;
  setDeletingTask: (loading: boolean) => void;
  
  setSelectedListId: (listId: number | null) => void;
  setSelectedTaskId: (taskId: number | null) => void;
  
  resetUI: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial modal states
      isCreateListModalOpen: false,
      isCreateTaskModalOpen: false,
      isEditListModalOpen: false,
      isEditTaskModalOpen: false,
      
      // Initial loading states
      isCreatingList: false,
      isCreatingTask: false,
      isUpdatingList: false,
      isUpdatingTask: false,
      isDeletingList: false,
      isDeletingTask: false,
      
      // Initial selected items
      selectedListId: null,
      selectedTaskId: null,
      
      // Modal actions
      openCreateListModal: () => set({ isCreateListModalOpen: true }),
      closeCreateListModal: () => set({ isCreateListModalOpen: false }),
      openCreateTaskModal: () => set({ isCreateTaskModalOpen: true }),
      closeCreateTaskModal: () => set({ isCreateTaskModalOpen: false }),
      openEditListModal: (listId: number) => set({ 
        isEditListModalOpen: true, 
        selectedListId: listId 
      }),
      closeEditListModal: () => set({ 
        isEditListModalOpen: false, 
        selectedListId: null 
      }),
      openEditTaskModal: (taskId: number) => set({ 
        isEditTaskModalOpen: true, 
        selectedTaskId: taskId 
      }),
      closeEditTaskModal: () => set({ 
        isEditTaskModalOpen: false, 
        selectedTaskId: null 
      }),
      
      // Loading state actions
      setCreatingList: (loading: boolean) => set({ isCreatingList: loading }),
      setCreatingTask: (loading: boolean) => set({ isCreatingTask: loading }),
      setUpdatingList: (loading: boolean) => set({ isUpdatingList: loading }),
      setUpdatingTask: (loading: boolean) => set({ isUpdatingTask: loading }),
      setDeletingList: (loading: boolean) => set({ isDeletingList: loading }),
      setDeletingTask: (loading: boolean) => set({ isDeletingTask: loading }),
      
      // Selection actions
      setSelectedListId: (listId: number | null) => set({ selectedListId: listId }),
      setSelectedTaskId: (taskId: number | null) => set({ selectedTaskId: taskId }),
      
      // Reset all UI state
      resetUI: () => set({
        isCreateListModalOpen: false,
        isCreateTaskModalOpen: false,
        isEditListModalOpen: false,
        isEditTaskModalOpen: false,
        isCreatingList: false,
        isCreatingTask: false,
        isUpdatingList: false,
        isUpdatingTask: false,
        isDeletingList: false,
        isDeletingTask: false,
        selectedListId: null,
        selectedTaskId: null,
      }),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain UI states, not loading states
      partialize: (state) => ({
        selectedListId: state.selectedListId,
        selectedTaskId: state.selectedTaskId,
      }),
    }
  )
);

// User Preferences Store
export interface UserPreferences {
  // Theme preferences
  theme: 'light' | 'dark' | 'system';
  
  // List view preferences
  defaultListSort: 'name' | 'created_at' | 'updated_at';
  defaultTaskSort: 'name' | 'created_at' | 'updated_at' | 'priority' | 'due_date';
  
  // Task preferences
  defaultTaskPriority: 'low' | 'medium' | 'high';
  defaultTaskStatus: 'pending' | 'in_progress' | 'completed';
  
  // UI preferences
  showCompletedTasks: boolean;
  showTaskDescriptions: boolean;
  compactView: boolean;
  
  // Notification preferences
  enableNotifications: boolean;
  reminderTime: number; // minutes before due date
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setDefaultListSort: (sort: 'name' | 'created_at' | 'updated_at') => void;
  setDefaultTaskSort: (sort: 'name' | 'created_at' | 'updated_at' | 'priority' | 'due_date') => void;
  setDefaultTaskPriority: (priority: 'low' | 'medium' | 'high') => void;
  setDefaultTaskStatus: (status: 'pending' | 'in_progress' | 'completed') => void;
  setShowCompletedTasks: (show: boolean) => void;
  setShowTaskDescriptions: (show: boolean) => void;
  setCompactView: (compact: boolean) => void;
  setEnableNotifications: (enable: boolean) => void;
  setReminderTime: (minutes: number) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  defaultListSort: 'created_at',
  defaultTaskSort: 'created_at',
  defaultTaskPriority: 'medium',
  defaultTaskStatus: 'pending',
  showCompletedTasks: true,
  showTaskDescriptions: true,
  compactView: false,
  enableNotifications: true,
  reminderTime: 30,
  
  setTheme: () => {},
  setDefaultListSort: () => {},
  setDefaultTaskSort: () => {},
  setDefaultTaskPriority: () => {},
  setDefaultTaskStatus: () => {},
  setShowCompletedTasks: () => {},
  setShowTaskDescriptions: () => {},
  setCompactView: () => {},
  setEnableNotifications: () => {},
  setReminderTime: () => {},
  resetPreferences: () => {},
};

export const usePreferencesStore = create<UserPreferences>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      
      setTheme: (theme) => set({ theme }),
      setDefaultListSort: (sort) => set({ defaultListSort: sort }),
      setDefaultTaskSort: (sort) => set({ defaultTaskSort: sort }),
      setDefaultTaskPriority: (priority) => set({ defaultTaskPriority: priority }),
      setDefaultTaskStatus: (status) => set({ defaultTaskStatus: status }),
      setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),
      setShowTaskDescriptions: (show) => set({ showTaskDescriptions: show }),
      setCompactView: (compact) => set({ compactView: compact }),
      setEnableNotifications: (enable) => set({ enableNotifications: enable }),
      setReminderTime: (minutes) => set({ reminderTime: minutes }),
      
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
