import React from 'react'
import { createBrowserRouter } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import { Link } from 'react-router'
import Protected from './features/auth/components/Protected'

const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: 
        <Protected>
            <div>Home
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </Protected>,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
])

export default appRoutes