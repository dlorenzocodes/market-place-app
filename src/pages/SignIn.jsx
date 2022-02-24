import { useState } from 'react'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {

    const [showPassword, setshowPassword] = useState(false)
    const [formData, setformData] = useState({
        email: '',
        password: ''
    })

    const {email, password} = formData

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            // eslint-disable-next-line 
            const user = userCredential.user

            if(userCredential.user){
                navigate('/')
            }

        }catch(error){
            toast.error('Bad User Credentials!')
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

                    <div className="signInBar">
                        <p className="signInText">Sign in</p>
                        <button className="signInButton">
                            <ArrowRightIcon fill='#fff' width='34px' height='34px' />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to='/sign-up' className='registerLink'>Sign Up</Link>
            </main>
        </div>
       </>
    )
}

export default SignIn
