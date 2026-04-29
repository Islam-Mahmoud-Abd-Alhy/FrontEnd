import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
function Signup() {
const navigate = useNavigate()
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [role, setRole] = useState('')
const handleSubmit = async (e) => {
  e.preventDefault()
  try{
    if(password.length < 6){
        toast.error("password must be at least 6 characters")
        return
    }
const respones = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, role: role.toLowerCase() })

    })
    await respones.json() 
    if(respones.ok){
        navigate('/login')
        toast.success("Created successfully you can sign in now")
    }
    else{
        toast.error("you have an accout please sign in")
        setTimeout(()=>{
        navigate('/login')
        },2000)
    }
  } catch (error) {
    console.error('Error:', error)
  }
  
}

  return (
<div className='bg-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
    <div className="absolute top-[-10%] right-[-10%] w-[20rem] h-[20rem] sm:w-[30rem] sm:h-[30rem] bg-red-900/20 rounded-full blur-[120px]"></div>
  <div className="absolute bottom-[-10%] left-[-10%] w-[22rem] h-[22rem] sm:w-[36rem] sm:h-[36rem] bg-cyan-900/20 rounded-full blur-[150px]"></div>

<div className='bg-[#111111] rounded-3xl border border-[#69DAFF]/20 shadow-[0_0_40px_rgba(105,218,255,0.15)] p-4 sm:p-6 mt-3 font-tech relative overflow-hidden w-full max-w-md'>
<div className="absolute top-0 left-[-70%] w-[18rem] h-20 bg-indigo-900/50 rounded-full blur-[120px]"></div>
  <h2 className='text-sm  text-start text-cyan-500 animate-pulse mt-5 font-bold'><span className='text-cyan-500 animate-pulse text-2xl'>•</span> SYSTEM INITIATION</h2>
  <p className='text-start text-[#ADAAAA] mt-2 font-bold text-2xl'>ENROLLMENT PROTOCOL</p>
  <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center mt-6'>
    <div className='mb-2 w-full'>
      <label htmlFor='name' className='block text-[#69DAFF] mb-2 font-mono text-sm'>Name</label>
      <input
        type='text'
        id='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='w-full max-w-sm bg-transparent border-b border-gray-800 py-3 text-sm focus:outline-none focus:border-[#69DAFF] transition-colors placeholder:text-gray-600 placeholder:text-[11px] placeholder:tracking-widest'
        placeholder='SECURE_IDENTIFIER_01'
      />
    </div>
    <div className='mb-2 w-full'>
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
    <div className='mb-2 w-full'>
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
    <div className='mb-2 w-full'>
      <label htmlFor='role' className='block text-[#69DAFF] mb-2 font-mono text-sm'>Role</label>
      <input
        type='text'
        id='role'
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className='w-full max-w-sm bg-transparent border-b border-gray-800 py-3 text-sm focus:outline-none focus:border-[#69DAFF] transition-colors placeholder:text-gray-600 placeholder:text-[11px] placeholder:tracking-widest'
        placeholder='your role in the system (teacher or student)'
      />
    </div>
    <button
      type='submit'
      className='bg-[#69DAFF] text-[#004A5D] transition-colors duration-300 hover:bg-[#26262574] hover:text-white cursor-pointer w-full max-w-sm p-3 mt-4 rounded-md border border-[#69DAFF] font-bold'
    >
CREATE IDENTITY
  </button>
<p className='text-white mt-5'>ALREADY REGISTERED?  <a href="/login" className="text-[#69DAFF] hover:underline">LOGIN</a></p>
  </form>
      </div>
</div>
  )
};

export default Signup;
