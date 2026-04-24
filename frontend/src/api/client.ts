const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("access_token");
    
    const headers = new Headers(options.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle unauthorized (expired token?)
        // In a real app, you might try to refresh here.
        // For now, let's clear token and redirect if not on login page
        localStorage.removeItem("access_token");
        if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || "Something went wrong");
    }

    // Some endpoints might return empty body
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body?: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
    delete: <T>(endpoint: string, options?: RequestInit) => 
        request<T>(endpoint, { ...options, method: "DELETE" }),
    upload: <T>(endpoint: string, formData: FormData, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: "POST", body: formData }),
};
