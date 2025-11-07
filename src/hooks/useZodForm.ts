import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseZodFormOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit?: (values: T) => Promise<void> | void;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

export function useZodForm<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
}: UseZodFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  const validateField = useCallback((field: keyof T, value: any) => {
    try {
      const fieldSchema = schema.shape[field as string];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({
          ...prev,
          [field]: undefined,
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = (error as any).errors?.[0]?.message;
        if (errorMessage) {
          setErrors(prev => ({
            ...prev,
            [field]: errorMessage,
          }));
        }
      }
    }
  }, [schema]);

  const validateForm = useCallback((): boolean => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};
        (error as any).errors?.forEach((err: any) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const shouldShowError = useCallback((field: keyof T) => {
    return touched[field as string] && errors[field as string];
  }, [touched, errors]);

  const getFieldError = useCallback((field: keyof T) => {
    return errors[field as string];
  }, [errors]);

  const isFormValid = Object.keys(errors).length === 0 && 
    Object.keys(values).every(key => values[key as keyof T]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    shouldShowError,
    getFieldError,
  };
} 