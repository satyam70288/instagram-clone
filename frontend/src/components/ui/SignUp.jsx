import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enableGuestMode } from '@/redux/authSlice';
import { Camera } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, guest } = useSelector(store => store.auth)
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };
  const handleGuestAccess = () => {
    dispatch(enableGuestMode());
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const res = await axios.post('/api/v1/user/register', input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // Ensure this is needed for your scenario
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Registration successful!');
        navigate('/login')
        console.log('Registration successful:', res.data);
      } else {
        toast.error(res.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Extract and display error message
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      toast.error(`Registration failed: ${errorMessage}`);
      console.error('Registration failed:', errorMessage);
    }
    finally {
      setLoading(false)
    }
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
          <h1 className='text-5xl font-bold leading-tight tracking-tight'>Your world is worth sharing.</h1>
          <p className='mt-5 text-lg text-white/75'>Join a creative community built around real moments, inspiring people, and meaningful connections.</p>
          <div className='mt-10 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm'>
            <p className='text-lg font-semibold'>Simple. Social. Yours.</p>
            <p className='mt-2 text-sm leading-6 text-white/70'>Create a profile, follow people you enjoy, and share photos and stories in seconds.</p>
          </div>
        </div>
      </section>
      <section className='flex flex-1 items-center justify-center p-6 sm:p-10'>
      <form onSubmit={handleSubmit} className='auth-card'>
        <div className='brand-mark text-slate-900 lg:hidden'><Camera size={20} /> PicShare</div>
        <div>
          <p className='text-sm font-semibold text-violet-600'>JOIN PICSHARE</p>
          <h2 className='mt-2 text-3xl font-bold tracking-tight text-slate-900'>Create your account</h2>
          <p className='mt-2 text-sm text-slate-500'>It only takes a minute to start sharing.</p>
        </div>
        <div>
          <Label className='mb-2 block text-sm font-medium text-slate-700' htmlFor='username'>Username</Label>
          <Input
            id='username'
            type="text"
            name="username"
            value={input.username}
            onChange={handleChange}
            placeholder='Choose a username'
            required
            className='h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500'
          />
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
            placeholder='Create a password'
            required
            className='h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-500'
          />
        </div>
        <Button className='h-12 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-base font-semibold shadow-lg shadow-violet-200 hover:opacity-90' type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
        <Button type='button' variant='outline' onClick={handleGuestAccess} className='h-12 rounded-xl border-slate-200'>Explore as guest</Button>
        <p className='text-center text-sm text-slate-500'>Already have an account? <Link className='font-semibold text-violet-600 hover:text-violet-700' to='/login'>Log in</Link></p>
      </form>
      </section>
    </main>
  );
};


export default SignUp
