import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatus = () => {

    const [loggedIn, setloggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const isMounted = useRef(true)

    useEffect(() => {
        if(isMounted){
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                // if user is authenticated
                if(user){
                    setloggedIn(true)
                }
                // Spinner
                setCheckingStatus(false)
            })
        }

        return () => {
            isMounted.current = false
        }
    }, [isMounted])


    return {loggedIn, checkingStatus}
}
