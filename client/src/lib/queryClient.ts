import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string);
        if (!res.ok) {
          throw new Error(`${res.status}: ${await res.text()}`);
        }
        return res.json();
      },
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status}: ${await res.text()}`);
  }

  return res;
}
