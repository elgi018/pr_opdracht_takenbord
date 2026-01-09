import { patchState } from '@ngrx/signals';
import { Observable, OperatorFunction, pipe, switchMap, tap, map } from 'rxjs';

// Async operation state
export interface AsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * Configuration for creating an async operation handler.
 *
 * @template TInput - The input type for the operation (e.g., CreateTaskDto, { id: string })
 * @template TResult - The result type from the API call (e.g., iTask, iTask[], string)
 * @template TState - The store state shape (must extend AsyncState)
 */
export interface AsyncOperationConfig<TInput, TResult, TState extends AsyncState> {
  /** The signal store instance */
  store: any;
  /** API service method to call - receives input and returns Observable */
  apiCall: (input: TInput) => Observable<TResult>;
  /** Custom state update logic on success - return partial state to patch (excluding loading/error which are handled automatically) */
  onSuccess: (result: TResult, currentStore: any) => Omit<Partial<TState>, 'loading' | 'error'>;
  /** Default error message if API error has no message */
  errorMessage: string;
}

/**
 * Creates a configured RxJS pipe for handling async operations in NgRx Signal Stores.
 *
 * This is a UNIVERSAL helper that works for ALL CRUD operations (Create, Read, Update, Delete).
 * The same helper handles all cases by using a flexible `onSuccess` callback.
 *
 * **How it works:**
 * 1. Sets loading=true and clears previous errors
 * 2. Executes the API call via switchMap
 * 3. On success: calls your custom onSuccess callback and sets loading=false
 * 4. On error: sets error message and sets loading=false
 *
 * @template TInput - Input type for the rxMethod
 * @template TResult - Result type from API call
 * @template TState - Store state shape (must include loading and error)
 * @param config - Configuration object with store, apiCall, onSuccess, and errorMessage
 * @returns A configured RxJS pipe operator for use with rxMethod
 */
export function createAsyncOperation<TInput, TResult, TState extends AsyncState>(
  config: AsyncOperationConfig<TInput, TResult, TState>
): OperatorFunction<TInput, void> {
  const { store, apiCall, onSuccess, errorMessage } = config;

  return pipe(
    // Step 1: Start loading, clear any previous errors
    tap(() => patchState(store, { loading: true, error: null } as Partial<TState>)),

    // Step 2: Execute the API call
    switchMap((input) => apiCall(input)),

    // Step 3: Handle success and error cases
    tap({
      next: (result) => {
        // Call custom state update logic + stop loading
        const customState = onSuccess(result, store);
        patchState(store, { ...customState, loading: false } as Partial<TState>);
      },
      error: (error) => {
        // Set error message + stop loading
        patchState(store, {
          error: error.message || errorMessage,
          loading: false,
        } as Partial<TState>);
      },
    }),

    // Step 4: Map to void to satisfy OperatorFunction<TInput, void>
    map(() => void 0)
  );
}
