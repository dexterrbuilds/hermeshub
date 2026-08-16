import { supabase } from "@/lib/supabase";
import { env } from "@/config/env";

export type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

class ApiClient {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!env.apiUrl) throw new Error("EXPO_PUBLIC_API_URL is not configured");
    const { data } = await supabase.auth.getSession();
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (data.session?.access_token) {
      headers.set("Authorization", `Bearer ${data.session.access_token}`);
    }

    const response = await fetch(`${env.apiUrl}${path}`, { ...options, headers });
    const text = await response.text();
    const json = text ? JSON.parse(text) as T | ApiErrorPayload : ({} as T);
    if (!response.ok) {
      const errorPayload = json as ApiErrorPayload;
      throw new Error(errorPayload.error?.message ?? "Hermes could not complete that request.");
    }
    return json as T;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
