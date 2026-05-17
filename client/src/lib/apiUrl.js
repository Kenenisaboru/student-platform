/** Shared API / socket base URL — avoids hitting another project's backend on shared ports. */
export const getApiBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, '');

  // Local dev: Vite proxies /api → http://127.0.0.1:5010 (see vite.config.js)
  if (import.meta.env.DEV) {
    return '/api';
  }

  return 'http://localhost:5010/api';
};

export const getSocketURL = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '');
  }

  // Local dev: socket.io proxied on same origin as the Vite app (port 5180)
  if (import.meta.env.DEV) {
    return window.location.origin;
  }

  return 'http://localhost:5010';
};
