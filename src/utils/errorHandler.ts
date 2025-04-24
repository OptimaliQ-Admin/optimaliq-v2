import { getErrorMessage } from "@/utils/errorHandler";

// src/utils/errorHandler.ts

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return typeof error === "string" ? error : "Unknown error";
  }
  