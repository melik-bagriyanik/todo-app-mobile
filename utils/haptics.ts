/**
 * Haptic Feedback Utilities
 * Provides consistent haptic feedback across the application
 */
import * as Haptics from 'expo-haptics';

// ==================== HAPTIC FEEDBACK FUNCTIONS ====================

/**
 * Raw haptic feedback functions for different intensities and types
 */
export const hapticFeedback = {
  /** Light haptic feedback for subtle interactions */
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  /** Medium haptic feedback for moderate interactions */
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  /** Heavy haptic feedback for strong interactions */
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  /** Success notification haptic */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  /** Warning notification haptic */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  /** Error notification haptic */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

// ==================== HOOK FOR HAPTIC FEEDBACK ====================

/**
 * Custom hook that provides semantic haptic feedback methods
 * Maps common UI interactions to appropriate haptic feedback
 */
export const useHapticFeedback = () => {
  return {
    /** Light haptic for toggle actions */
    onToggle: () => hapticFeedback.light(),
    /** Medium haptic for delete actions */
    onDelete: () => hapticFeedback.medium(),
    /** Success haptic for successful operations */
    onSuccess: () => hapticFeedback.success(),
    /** Error haptic for failed operations */
    onError: () => hapticFeedback.error(),
    /** Warning haptic for cautionary actions */
    onWarning: () => hapticFeedback.warning(),
  };
};
