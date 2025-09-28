/**
 * UI State Store - Global state management for UI interactions
 * Features: Modal states, loading states, selected items, persistence
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * UI State Interface - Defines all UI-related state and actions
 */
export interface UIState {
  // ==================== MODAL STATES ====================
  isCreateListModalOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isEditListModalOpen: boolean;
  isEditTaskModalOpen: boolean;
  
  // ==================== LOADING STATES ====================
  isCreatingList: boolean;
  isCreatingTask: boolean;
  isUpdatingList: boolean;
  isUpdatingTask: boolean;
  isDeletingList: boolean;
  isDeletingTask: boolean;
  
  // ==================== SELECTED ITEMS ====================
  selectedListId: number | null;
  selectedTaskId: number | null;
  
  // ==================== MODAL ACTIONS ====================
  openCreateListModal: () => void;
  closeCreateListModal: () => void;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;
  openEditListModal: (listId: number) => void;
  closeEditListModal: () => void;
  openEditTaskModal: (taskId: number) => void;
  closeEditTaskModal: () => void;
  
  // ==================== LOADING ACTIONS ====================
  setCreatingList: (loading: boolean) => void;
  setCreatingTask: (loading: boolean) => void;
  setUpdatingList: (loading: boolean) => void;
  setUpdatingTask: (loading: boolean) => void;
  setDeletingList: (loading: boolean) => void;
  setDeletingTask: (loading: boolean) => void;
  
  // ==================== SELECTION ACTIONS ====================
  setSelectedListId: (listId: number | null) => void;
  setSelectedTaskId: (taskId: number | null) => void;
  
  // ==================== UTILITY ACTIONS ====================
  resetUI: () => void;
}

/**
 * UI Store Implementation with Zustand and persistence
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // ==================== INITIAL STATE ====================
      
      // Modal states - all initially closed
      isCreateListModalOpen: false,
      isCreateTaskModalOpen: false,
      isEditListModalOpen: false,
      isEditTaskModalOpen: false,
      
      // Loading states - all initially false
      isCreatingList: false,
      isCreatingTask: false,
      isUpdatingList: false,
      isUpdatingTask: false,
      isDeletingList: false,
      isDeletingTask: false,
      
      // Selected items - initially null
      selectedListId: null,
      selectedTaskId: null,
      
      // ==================== MODAL ACTIONS ====================
      
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
      
      // ==================== LOADING ACTIONS ====================
      
      setCreatingList: (loading: boolean) => set({ isCreatingList: loading }),
      setCreatingTask: (loading: boolean) => set({ isCreatingTask: loading }),
      setUpdatingList: (loading: boolean) => set({ isUpdatingList: loading }),
      setUpdatingTask: (loading: boolean) => set({ isUpdatingTask: loading }),
      setDeletingList: (loading: boolean) => set({ isDeletingList: loading }),
      setDeletingTask: (loading: boolean) => set({ isDeletingTask: loading }),
      
      // ==================== SELECTION ACTIONS ====================
      
      setSelectedListId: (listId: number | null) => set({ selectedListId: listId }),
      setSelectedTaskId: (taskId: number | null) => set({ selectedTaskId: taskId }),
      
      // ==================== UTILITY ACTIONS ====================
      
      /**
       * Resets all UI state to initial values
       */
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
      // Only persist selected items, not modal states or loading states
      partialize: (state) => ({
        selectedListId: state.selectedListId,
        selectedTaskId: state.selectedTaskId,
      }),
    }
  )
);
