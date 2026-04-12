import React from 'react'
import '../authForm.scss'
import { Link } from 'react-router';

const Login = () => {

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login");
    }
    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='Email......' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder='Password' />
                    </div>
                    <button className='button primary-button' type='submit'>Login</button>
                </form>
                <p>Don't have an account ? <Link to="/register">Register</Link></p> 
            </div>
        </main>
    )
}

export default Login