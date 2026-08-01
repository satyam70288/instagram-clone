import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser,enableGuestMode } from '@/redux/authSlice';
import { Camera, Compass, Heart, Users } from 'lucide-react';
import { saveAuthToken } from '@/lib/authStorage';
import GoogleAuthButton from '@/components/GoogleAuthButton';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, guest } = useSelector(store => store.auth)
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      setLoading(true);
      const res = await axios.post('/api/v1/user/login', input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        const headerAuth = res.headers?.authorization || res.headers?.Authorization;
        const token = res.data.token || (headerAuth?.startsWith('Bearer ') ? headerAuth.split(' ')[1] : null);
        if (token) {
          saveAuthToken(token);
        }
        toast.success(res.data.message || 'Login successful!');
        navigate('/');
      } else {
        toast.error(res.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      toast.error(`Login failed: ${errorMessage}`);
      console.error('Login failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleGuestAccess = () => {
    dispatch(enableGuestMode());
    navigate("/"); // Redirect to the homepage
  };
  useEffect(() => {
    if (user && !guest) {
      navigate('/')
    }
  }, [user, guest, navigate])
  return (
    <main className='auth-shell'>
      <section className='hidden lg:flex auth-showcase'>
        <div className='relative z-10 max-w-lg'>
          <div className='brand-mark mb-10'><Camera size={22} /> PicShare</div>
          <h1 className='text-5xl font-bold leading-tight tracking-tight'>Share the moments that make life yours.</h1>
          <p className='mt-5 text-lg text-white/75'>A friendly place to discover ideas, follow people you love, and tell your story.</p>
          <div className='mt-10 grid grid-cols-3 gap-4 text-sm text-white/80'>
            <span className='auth-feature'><Compass /> Discover</span>
            <span className='auth-feature'><Heart /> Connect</span>
            <span className='auth-feature'><Users /> Belong</span>
          </div>
        </div>
      </section>

      <section className='flex flex-1 items-center justify-center p-6 sm:p-10'>
        <form onSubmit={handleSubmit} className='auth-card'>
          <div className='brand-mark text-slate-900 lg:hidden'><Camera size={20} /> PicShare</div>
          <div>
            <p className='text-sm font-semibold text-violet-600'>WELCOME BACK</p>
            <h2 className='mt-2 text-3xl font-bold tracking-tight text-slate-900'>Log in to your account</h2>
            <p className='mt-2 text-sm text-slate-500'>See new posts and stay close to your community.</p>
          </div>
          <div>
          <Label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='email'>Email address</Label>
          <Input
            id='email'
            type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
            placeholder='you@example.com'
            required
            className='h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500'
          />
        </div>
        <div>
          <Label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='password'>Password</Label>
          <Input
            id='password'
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            placeholder='Enter your password'
            required
            className='h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500'
          />
        </div>
        <Button className='h-12 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-base font-semibold shadow-lg shadow-violet-200 hover:opacity-90' type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <div className='flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400'>
          <span className='h-px flex-1 bg-slate-200' /> or <span className='h-px flex-1 bg-slate-200' />
        </div>
        <GoogleAuthButton onBusyChange={setLoading} />
        <Button type='button' variant='outline' onClick={handleGuestAccess} className='h-auto min-h-12 rounded-xl border-slate-200 py-3'>
          <span><strong className='block text-slate-800'>Explore as a guest</strong><small className='font-normal text-slate-500'>No account needed · Browse only</small></span>
        </Button>
        <p className='text-center text-sm text-slate-500'>New to PicShare? <Link className='font-semibold text-violet-600 hover:text-violet-700' to='/signup'>Create an account</Link></p>
        </form>
      </section>
    </main>
  );
};

export default Login;
