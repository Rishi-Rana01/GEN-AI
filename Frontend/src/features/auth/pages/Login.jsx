import React, { useState } from 'react'
import '../authForm.scss'
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const Login = () => {

    const navigate= useNavigate()

    const {loading,handleLogin} = useAuth()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const handleSubmit = async(e) => {
        e.preventDefault();
        await handleLogin({email,password})
        navigate('/')
        console.log("Login");
    }
    if(loading){
        return <div><h1>Loading...</h1></div>
    }
    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Email......' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
                    </div>
                    <button className='button primary-button' type='submit'>Login</button>
                </form>
                <p>Don't have an account ? <Link to="/register">Register</Link></p> 
            </div>
        </main>
    )
}

export default Login