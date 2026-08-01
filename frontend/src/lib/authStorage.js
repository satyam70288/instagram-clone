import Cookies from 'js-cookie';

export function saveAuthToken(token) {
  if (!token) return;
  localStorage.setItem('authToken', token);
  Cookies.set('token', token, { expires: 1, sameSite: 'Lax' });
}

export function clearAuthToken() {
  localStorage.removeItem('authToken');
  Cookies.remove('token');
}

export function getAuthToken() {
  return localStorage.getItem('authToken') || Cookies.get('token') || null;
}
