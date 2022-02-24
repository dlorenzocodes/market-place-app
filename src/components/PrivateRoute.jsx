import {Navigate, Outlet} from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from '../components/Spinner'

const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus()

    if(checkingStatus){
        return  <Spinner />
    }

    // Outlet renders the nested route inside the Private Route
    return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
