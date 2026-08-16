export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API === "true"
};

export function shouldUseMockApi() {
  return env.useMockApi || !env.apiUrl || !env.supabaseUrl || !env.supabaseAnonKey;
}
