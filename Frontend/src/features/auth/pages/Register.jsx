import React from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Register");
        navigate("/login");
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder='Username' />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='Email' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder='Password' />
                </div>
                <button className='button primary-button' type='submit'>Register</button>
            </form>
           <p>Already have an account ? <Link to="/login">Login</Link></p>
        </div>
    </main>

  )
}

export default Register