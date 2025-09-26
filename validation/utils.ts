import { z } from 'zod';
import { Alert } from 'react-native';

// Generic validation function
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      return { success: false, error: errorMessage };
    }
    return { 
      success: false, 
      error: errorMessage || 'Validation failed' 
    };
  }
};

// Validation with alert
export const validateWithAlert = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorTitle: string = 'Validation Error'
): T | null => {
  const result = validateData(schema, data);
  
  if (!result.success) {
    Alert.alert(errorTitle, result.error);
    return null;
  }
  
  return result.data;
};

// Safe validation (returns null on error)
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null => {
  const result = validateData(schema, data);
  return result.success ? result.data : null;
};

// Validation for form inputs
export const validateFormInput = (
  value: string,
  minLength: number = 1,
  maxLength: number = 100,
  fieldName: string = 'Field'
): { isValid: boolean; error?: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (value.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (value.trim().length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { isValid: true };
};

// Validation for numeric inputs
export const validateNumericInput = (
  value: string,
  fieldName: string = 'Field'
): { isValid: boolean; error?: string; numericValue?: number } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const numericValue = parseInt(value.trim());
  
  if (isNaN(numericValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (numericValue <= 0) {
    return { isValid: false, error: `${fieldName} must be a positive number` };
  }
  
  return { isValid: true, numericValue };
};

// Validation for enum values
export const validateEnumValue = <T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string = 'Field'
): { isValid: boolean; error?: string; enumValue?: T } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const trimmedValue = value.trim().toLowerCase();
  const enumValue = allowedValues.find(val => val.toLowerCase() === trimmedValue);
  
  if (!enumValue) {
    return { 
      isValid: false, 
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}` 
    };
  }
  
  return { isValid: true, enumValue };
};
