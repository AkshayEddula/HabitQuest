import { useState, useCallback } from 'react';

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | undefined>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback((field: keyof T, value: any) => {
    const error = validationRules[field]?.(value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    return !error;
  }, [validationRules]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    validate(field, value);
  }, [validate]);

  const isValid = useCallback(() =>
    Object.keys(validationRules).every(field =>
      !validationRules[field as keyof T](values[field as keyof T])
    )
  , [values, validationRules]);

  return {
    values,
    errors,
    handleChange,
    isValid,
    validate
  };
}
