import { HttpErrorResponse } from '@angular/common/http';

interface ApiErrorBody {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }

  if (error.status === 0) {
    return 'Unable to connect to the server. Please check that the backend is running.';
  }

  if (typeof error.error === 'string') {
    const message = error.error.trim();

    return message || fallbackMessage;
  }

  const errorBody =
    error.error as ApiErrorBody | null;

  if (errorBody?.message) {
    return errorBody.message;
  }

  if (errorBody?.errors) {
    const validationMessages =
      Object.values(errorBody.errors)
        .flat()
        .filter(message => Boolean(message));

    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }
  }

  if (errorBody?.title) {
    return errorBody.title;
  }

  switch (error.status) {
    case 400:
      return 'The submitted information is invalid.';

    case 401:
      return 'Please sign in to continue.';

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return 'The requested information was not found.';

    case 409:
      return 'The request conflicts with existing information.';

    case 500:
      return 'The server encountered an error. Please try again later.';

    default:
      return fallbackMessage;
  }
}