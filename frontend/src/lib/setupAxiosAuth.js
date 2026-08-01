import axios from 'axios';
import { server } from '@/constant/config';
import { getAuthToken } from '@/lib/authStorage';
import { forceLoginRedirect, isTokenExpired } from '@/lib/session';

const AUTH_SKIP_PATHS = ['/login', '/register', '/signup'];

function shouldSkipAuthRedirect(url = '') {
  return AUTH_SKIP_PATHS.some((path) => url.includes(path));
}

export function setupAxiosAuth(store) {
  axios.defaults.baseURL = server;
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      // Proactive: token already expired before request
      if (isTokenExpired(token) && !shouldSkipAuthRedirect(config.url || '')) {
        forceLoginRedirect('Your session has expired. Please log in again.', store);
        return Promise.reject(new Error('Session expired'));
      }
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url || '';
      const message = error.response?.data?.message || '';

      const expired =
        status === 401 &&
        !shouldSkipAuthRedirect(url) &&
        (
          /expired|invalid token|not authenticated|unauthorized/i.test(message) ||
          status === 401
        );

      if (expired) {
        forceLoginRedirect(
          message.includes('expired')
            ? 'Your session has expired. Please log in again.'
            : 'Please log in again to continue.',
          store
        );
      }

      return Promise.reject(error);
    }
  );
}
