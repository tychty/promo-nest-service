export const isDuplicateKeyError = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && error.code === '23505';
