import { toast } from 'sonner';
import { clearAuthToken, getAuthToken } from './authStorage';
import { removeAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

let loggingOut = false;

/** Decode JWT and check if it is expired (with 10s buffer). */
export function isTokenExpired(token = getAuthToken()) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now() + 10_000;
  } catch {
    return true;
  }
}

/**
 * Clear auth and open login page.
 * Safe to call many times — only runs once until reset.
 */
export function forceLoginRedirect(message = 'Session expired. Please log in again.', store) {
  if (loggingOut || !store) return;
  const { auth } = store.getState();

  // Guest mode has no JWT — don't kick guests for API 401s
  if (auth.guest) return;
  // Already logged out
  if (!auth.user && !getAuthToken()) {
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
      window.location.assign('/login');
    }
    return;
  }

  loggingOut = true;
  clearAuthToken();
  store.dispatch(removeAuthUser());
  store.dispatch(setSelectedPost(null));
  store.dispatch(setPosts([]));

  toast.error(message);

  const onAuthPage =
    window.location.pathname.includes('/login') ||
    window.location.pathname.includes('/signup');

  if (!onAuthPage) {
    window.location.assign('/login');
  }

  setTimeout(() => {
    loggingOut = false;
  }, 2500);
}
