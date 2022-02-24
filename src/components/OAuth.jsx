import { toast } from 'react-toastify'
import { db } from '../config/firebase.config'
import googleIcon from '../assets/svg/googleIcon.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'


function OAuth() {

    const navigate = useNavigate()
    const location = useLocation()

    const onGoogle = async () => {
        try{
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // get a refernece of the user
            const userRef = doc(db, 'users', user.uid)

            // reads the user reference
            const userSnap = await getDoc(userRef)

            // Check if user already exists, if not add user to db
            if(!userSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }

            navigate('/')
        }catch(error){
            toast.error('Could not authorized with Google!')
        }
    }

    return (
        <div className='socialLogin'>
            <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
            <button className="socialIconDiv" onClick={onGoogle}>
                <img className='socialIconImg' src={googleIcon} alt="google"/>
            </button>
        </div>
    )
}

export default OAuth
