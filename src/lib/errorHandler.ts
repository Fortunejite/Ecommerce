import { AxiosError } from 'axios';

interface MongooseError extends Error {
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: unknown;
  code?: number;
}

export const handleMongooseError = (
  error: MongooseError
): Record<string, string> | string | null => {
  if (error.name === 'ValidationError' && error.errors) {
    return Object.entries(error.errors).reduce((acc, [key, { message }]) => {
      acc[key] = message;
      return acc;
    }, {} as Record<string, string>);
  }

  if (error.name === 'CastError' && error.path && error.value) {
    return `Invalid value for ${error.path}: ${error.value}`;
  }

  if (error.code === 11000) {
    return 'Duplicate entry detected';
  }

  return null;
};

export function errorHandler(error: unknown): string {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('Axios Error:', error);
    return message;
  }

  // Handle errors with a name (likely Mongoose or application errors)
  if (error instanceof Error) {
    const mongooseErr = handleMongooseError(error as MongooseError);
    if (mongooseErr) {
      // If mongooseErr is an object, stringify it for display
      return typeof mongooseErr === 'string'
        ? mongooseErr
        : JSON.stringify(mongooseErr);
    }
    console.error('Application Error:', error.message);
    return error.message || 'An unexpected error occurred.';
  }

  // Fallback for unknown error types
  console.error('Unknown Error:', error);
  return 'An unknown error occurred. Please try again.';
}
