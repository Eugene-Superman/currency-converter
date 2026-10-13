import { ApiError } from "../error/ApiError";

export const fetchRequest = async <T>(url: string, init: RequestInit = {}) => {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return (await response.json()) as T;
};
