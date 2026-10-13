export class ApiError extends Error {
  readonly name = "ApiError";
  readonly status: number;

  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.status = status;
  }
}

export function isRetryableError(error: Error): boolean {
  return !(error instanceof ApiError && error.status < 500);
}
