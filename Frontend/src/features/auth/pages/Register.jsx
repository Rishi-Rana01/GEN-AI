import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const {loading,handleRegister}= useAuth()

    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit = async(e) => {
        e.preventDefault();
        await handleRegister({username,email,password})
        console.log("Register");
        navigate("/");
    }
    if(loading){
        return <div><h1>Loading...</h1></div>
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" onChange={(e)=>setUsername(e.target.value)} placeholder='Username' />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Email' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input  type="password" onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
                </div>
                <button className='button primary-button' type='submit'>Register</button>
            </form>
           <p>Already have an account ? <Link to="/login">Login</Link></p>
        </div>
    </main>

  )
}

export default Register