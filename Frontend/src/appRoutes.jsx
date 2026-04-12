import React from 'react'
import { createBrowserRouter } from 'react-router'
import Login from './features/auth/pages/login'
import Register from './features/auth/pages/Register'
import { Link } from 'react-router'

const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <div>Home
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>,
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