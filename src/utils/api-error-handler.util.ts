import { AxiosError } from "axios";

export function apiErrorHandler(error: any) {
  if (error instanceof AxiosError) {
    console.error("Error creating snippet:", error.response?.data.message);
  } else {
    console.error("Error creating snippet:", error);
  }
}
