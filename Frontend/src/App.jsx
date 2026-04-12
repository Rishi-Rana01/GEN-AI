import { RouterProvider } from 'react-router'
import appRoutes from './appRoutes.jsx'
import { AuthProvider } from './features/auth/authContext.jsx'
function App() {


  return (
    <>
      <AuthProvider>
        <RouterProvider router={appRoutes} />
      </AuthProvider>


    </>
  )
}

export default App
