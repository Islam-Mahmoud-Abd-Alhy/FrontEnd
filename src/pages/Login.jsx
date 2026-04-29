import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { setLoading as setStudentLoading, setStudent } from '../redux/StudentSlice'
import { useDispatch } from 'react-redux';
import { setTeacher } from '../redux/TeacherSlice';
import toast from 'react-hot-toast';
function Login() {
const navigate = useNavigate()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const dispatch = useDispatch();
const handleSubmit = async (e) => {
  e.preventDefault()
  try{
    if(password.length < 6){
        toast.error("password must be at least 6 characters")
        return
    }
const respones = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
body: JSON.stringify({ email, password })
    })
    const data = await respones.json() 
    if(data.user && data.success){
      const normalizedUser = {
        ...data.user,
        name: data.user.name || '',
        role: String(data.user.role || '').toLowerCase(),
      };
    if(normalizedUser.role === "student" && respones.ok){
        dispatch(setTeacher(null));
        dispatch(setStudent(normalizedUser)); 
        toast.success("Welcome Student! Access Granted");
        navigate('/dashboard')
    }
    else if(normalizedUser.role === "teacher" && respones.ok){
        dispatch(setStudent(null));
        dispatch(setTeacher(normalizedUser));
        toast.success("Welcome Teacher! Access Granted");
        navigate('/dashboard')
    }
    else{
        toast.error("you have not an accout please sign up")
        setTimeout(()=>{
        navigate('/signup')
        },2000)
    }
  }else{
    toast.error(data.message || "Login failed - check your credentials");
  }
  } catch (error) {
    dispatch(setStudentLoading(false));
    console.error('Error:', error)
  }
  
}

  return (
    <div className='bg-black min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden font-tech relative'>
  <div className="absolute top-[-10%] right-[-10%] w-[20rem] h-[20rem] sm:w-[30rem] sm:h-[30rem] bg-red-900/20 rounded-full blur-[120px]"></div>
  
  <div className="absolute bottom-[-10%] left-[-10%] w-[22rem] h-[22rem] sm:w-[36rem] sm:h-[36rem] bg-cyan-900/10 rounded-full blur-[150px]"></div>
  <div className='p-4 bg-[#26262574] rounded-2xl border border-[#69DAFF] shadow-[0_0_15px_rgba(105,218,255,0.4)] shadow-[#69DAFF]/50'>
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" viewBox="0 0 40 32" fill="none">
<path d="M4 32C2.9 32 1.95833 31.6083 1.175 30.825C0.391667 30.0417 0 29.1 0 28V4C0 2.9 0.391667 1.95833 1.175 1.175C1.95833 0.391667 2.9 0 4 0H36C37.1 0 38.0417 0.391667 38.825 1.175C39.6083 1.95833 40 2.9 40 4V28C40 29.1 39.6083 30.0417 38.825 30.825C38.0417 31.6083 37.1 32 36 32H4V32M4 28H36V28V28V8H4V28V28V28V28M11 26L8.2 23.2L13.35 18L8.15 12.8L11 10L19 18L11 26V26M20 26V22H32V26H20V26" fill="#69DAFF"/>
</svg>
</div>
<div className='bg-[#111111] rounded-3xl border border-[#69DAFF]/20 shadow-[0_0_40px_rgba(105,218,255,0.15)] p-4 sm:p-6 mt-3 w-full max-w-md'>
  <h2 className='text-xl sm:text-2xl text-center text-white mt-5 font-bold'>SYSTEM INITIALIZATION</h2>
  <p className='text-center text-[#ADAAAA] mt-2 font-bold'>IDENTITY VERIFICATION REQUIRED</p>
  <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center mt-6'>
    <div className='mb-4 w-full'>
      <label htmlFor='email' className='block text-[#69DAFF] mb-2 font-mono text-sm'>Email</label>
      <input
        type='email'
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full max-w-sm bg-transparent border-b border-gray-800 py-3 text-sm focus:outline-none focus:border-[#69DAFF] transition-colors placeholder:text-gray-600 placeholder:text-[11px] placeholder:tracking-widest'
        placeholder=' @  USER_IDENTIFIER@GTA.CORE'
      />
    </div>
    <div className='mb-4 w-full'>
      <label htmlFor='password' className='block text-[#69DAFF] mb-2 font-mono text-sm'>ACCESS KEY</label>
      <input
        type='password'
        id='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full max-w-sm bg-transparent border-b border-gray-800 py-3 text-sm focus:outline-none focus:border-[#69DAFF] transition-colors placeholder:text-gray-600 placeholder:text-[11px] placeholder:tracking-widest'
        placeholder=' ••••••••••••'
      />
    </div>
    <button
      type='submit'
      className='bg-[#69DAFF] text-[#004A5D] transition-colors duration-300 hover:bg-[#26262574] hover:text-white cursor-pointer w-full max-w-sm p-3 mt-4 rounded-md border border-[#69DAFF] font-bold'
    >
INITIALIZE SESSION
    </button>
  </form>
  <button
      type='submit'
      className='border border-[#69DAFF] w-full max-w-sm p-3 text-white cursor-pointer mt-7 rounded-md hover:bg-[#69DAFF] hover:text-[#004A5D] transition-colors duration-300 font-bold'
      onClick={() => navigate('/signup')}
    >
REQUEST NEW ACCESS KEY
    </button>
      </div>
</div>
  )
};

export default Login;
