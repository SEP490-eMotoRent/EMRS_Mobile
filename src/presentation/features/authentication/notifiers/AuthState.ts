export type AuthState =
    | { type: 'initial' }
    | { type: 'loading' }
    | { type: 'success' }
    | { type: 'error'; message: string };