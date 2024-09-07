import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import  {setAuthUser}  from '@/redux/authSlice';
import Cookies from 'js-cookie';  // Import js-cookie

const Login = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {user}=useSelector(store=>store.auth)
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
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
  
      if (res.data.success) {
         dispatch(setAuthUser(res.data.user))
         console.log(res.headers['authorization'])
         const token = res.headers['authorization'].split(' ')[1];
      
         // Store the token in localStorage
         localStorage.setItem('authToken', token);
        //  
         console.log('Token stored in localStorage:', token);
           toast.success(res.data.message || 'Login successful!');
        navigate('/');
        console.log('Login successful:', res.data);
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
  
  useEffect(() => {
    if(user){
      navigate('/')
    }
  })
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={handleSubmit} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>Logo</h1>
          <p>Log in to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className='py-2 font-medium' htmlFor='email'>Email</Label>
          <Input 
            type="email" 
            name="email" 
            value={input.email} 
            onChange={handleChange} 
            className='focus-visible:ring-transparent'
          />
        </div>
        <div>
          <Label className='py-2 font-medium' htmlFor='password'>Password</Label>
          <Input 
            type="password" 
            name="password" 
            value={input.password} 
            onChange={handleChange} 
            className='focus-visible:ring-transparent'
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <span className='text-center' >Don't have an account? <Link className='text-blue-300' to='/signup'>Register</Link></span>
      </form>
    </div>
  );
};

export default Login;
