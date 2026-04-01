// Centralized configuration for dynamic API base URL.
// Defaults to localhost for development but consumes VITE_API_URL in production.

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
