import { createContext , useState, useEffect } from "react";
import {getMe} from "./services/authApi"

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAndSetUser = async() => {
            try{
                const response = await getMe()
                if (response?.user) {
                    setUser(response.user)
                } else {
                    setUser(null)
                }
            }catch(error){
                console.log(error)
                setUser(null)
            }finally{
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])  

  
    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
} 