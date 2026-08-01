import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { saveAuthToken } from '@/lib/authStorage';
import { useState } from 'react';

/**
 * Shared Google Sign-In button for Login + SignUp pages.
 * Gets Google ID token → sends to our backend → stores our JWT.
 */
const GoogleAuthButton = ({ onBusyChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className='rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700'>
        Google login is not configured. Add <code>VITE_GOOGLE_CLIENT_ID</code> in frontend env.
      </p>
    );
  }

  const handleSuccess = async (response) => {
    try {
      setLoading(true);
      onBusyChange?.(true);

      const res = await axios.post(
        '/api/v1/user/google-login',
        { credential: response.credential },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        if (res.data.token) saveAuthToken(res.data.token);
        toast.success(res.data.message || 'Signed in with Google');
        navigate('/');
      } else {
        toast.error(res.data.message || 'Google login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
      onBusyChange?.(false);
    }
  };

  return (
    <div className={`flex w-full flex-col items-center gap-2 ${loading ? 'pointer-events-none opacity-70' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled or failed')}
        useOneTap={false}
        theme='outline'
        size='large'
        width='100%'
        text='continue_with'
        shape='pill'
      />
      {loading && <p className='text-xs text-slate-500'>Signing you in…</p>}
    </div>
  );
};

export default GoogleAuthButton;
