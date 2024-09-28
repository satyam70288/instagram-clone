import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SignUp = () => {
  const navigate=useNavigate()
  const {user}=useSelector(store=>store.auth)
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading,setLoading]=useState(false)

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
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
    finally{
      setLoading(false)
    }
  };
   useEffect(()=>{
    if(user){
      navigate('/')
    }
   },[])
  
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={handleSubmit} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>Logo</h1>
          <p>Sign Up to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className='py-2 font-medium' htmlFor='username'>Username</Label>
          <Input 
            type="text" 
            name="username" 
            value={input.username} 
            onChange={handleChange} 
            className='focus-visible:ring-transparent'
          />
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
        <Button type="submit">Sign Up</Button>
        <span className='text-blue-300'>Alraedy have an account? <Link to='/login'>login</Link></span>
      </form>
    </div>
  );
};


export default SignUp
