import { useState } from 'react'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'
import { db } from '../config/firebase.config'
import { Link, useNavigate } from 'react-router-dom'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function SignUp() {

    const [showPassword, setshowPassword] = useState(false)
    const [formData, setformData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const {name, email, password} = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setformData((prevState) => ({

            // it keeps either email or password on the state depending on
            // where I am typing
            ...prevState,

            // sets the input value to either email or password
            // depending on the target id
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try{
            const auth = getAuth()
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user

            updateProfile(user,{
                displayName: name
            })

            // saving to the database firestore
            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()
            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')

        }catch(error){
            toast.error('Something went wrong. Try again later!')
        }
    }

    return (
       <>
        <div className="pageContainer">
            <header>
                <p className="pageHeader">
                    Welcome Back!
                </p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <input 
                        type="text" 
                        className="nameInput" 
                        placeholder="Name"
                        id="name"
                        value={name}
                        onChange={onChange}
                    />

                    <input 
                        type="email" 
                        className="emailInput" 
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={onChange}
                    />

                    <div className="passwordInputDiv">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            className="passwordInput"
                            placeholder="Password"
                            id='password'
                            value={password}
                            onChange={onChange}
                        />

                        <img 
                            src={visibilityIcon} 
                            alt="show password" 
                            className="showPassword"
                            onClick={() => setshowPassword((prevState) => !prevState)}
                        />
                    </div>

                    <Link 
                        to='/forgot-password' 
                        className="forgotPasswordLink">
                            Forgot Password
                    </Link>

                    <div className="signUpBar">
                        <p className="signUpText">Sign Up</p>
                        <button className="signUpButton">
                            <ArrowRightIcon fill='#fff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
            </main>
        </div>
       </>
    )
}

export default SignUp
