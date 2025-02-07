// import { logout } from '@/redux/authSlice';
// import store from '@/redux/store';
import { AxiosError } from 'axios';

export function errorHandler(error: unknown): string {
  // Check if the error is an AxiosError
  if (error instanceof AxiosError) {
    // if (error.response?.status === 401) {
    //   store.dispatch(logout());
    // }
    const message = error.response?.data?.message || 'An error occurred';
    console.error('Error:', error);
    return message;
  }

  // Handle other types of errors
  if (error instanceof Error) {
    console.error('Application Error:', error.message);
    return error.message || 'An unexpected error occurred.';
  }

  // Fallback for unknown errors
  console.error('Unknown Error:', error);
  return 'An unknown error occurred. Please try again.';
}

interface MongooseError extends Error {
  name: string;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: unknown;
  code?: number;
}

export const handleMongooseError = (error: MongooseError): string[] => {
  if (error.name === "ValidationError" && error.errors) {
    return Object.values(error.errors).map((err) => (err as { message: string }).message);
  }

  if (error.name === "CastError" && error.path && error.value) {
    return [`Invalid value for ${error.path}: ${error.value}`];
  }

  if (error.code === 11000) {
    return ["Duplicate entry detected"];
  }

  return ["An unexpected error occurred"];
};