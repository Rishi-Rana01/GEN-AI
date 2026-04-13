import { useContext } from "react";
import { AuthContext } from "../authContext";
import { login, register, logout, getMe } from "../services/authApi"


export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {

        setLoading(true)

        try {
            const data = await login({ email, password })

            if (data.success) {
                setUser(data.user)
            }

            return data

        } catch (error) {
            console.log(error)
            return error.response.data

        } finally {
            setLoading(false)
        }

    }

    const handleRegister = async ({ username, email, password }) => {

        setLoading(true)

        try {
            const data = await register({ username, email, password })

            if (data.success) {
                setUser(data.user)
            }

            return data

        } catch (error) {
            console.log(error)
            return error.response.data

        } finally {
            setLoading(false)
        }

    }

    const handleLogout = async () => {

        setLoading(true)

        try {
            const data = await logout()

            if (data.success) {
                setUser(null)
            }

            return data

        } catch (error) {
            console.log(error)
            return error.response.data

        } finally {
            setLoading(false)
        }

    }

    const handleGetMe = async () => {

        setLoading(true)

        try {
            const data = await getMe()

            if (data.success) {
                setUser(data.user)
            }

            return data

        } catch (error) {
            console.log(error)
            return error.response.data

        } finally {
            setLoading(false)
        }

    }

    return {
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe
    }

}