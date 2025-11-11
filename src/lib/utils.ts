import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom fetch function with comprehensive logging
export async function loggedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const startTime = Date.now();
  const method = options.method || 'GET';

  console.log(`🚀 API Request: ${method} ${url}`, {
    timestamp: new Date().toISOString(),
    method,
    url,
    headers: options.headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : '[Request Body]') : undefined,
  });

  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    console.log(`✅ API Response: ${method} ${url}`, {
      timestamp: new Date().toISOString(),
      method,
      url,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Log error responses
    if (!response.ok) {
      console.error(`❌ API Error: ${method} ${url}`, {
        timestamp: new Date().toISOString(),
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
      });
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error(`💥 API Network Error: ${method} ${url}`, {
      timestamp: new Date().toISOString(),
      method,
      url,
      duration: `${duration}ms`,
      error: error.message,
    });

    throw error;
  }
}
