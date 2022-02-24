import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {

    const [email, setEmail] = useState('')


    const onChange = (e) => {
        setEmail(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try{
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Email was sent!')
        }catch(error){
            toast.error('Email could not be sent. Try again!')
        }
        
    }


    return (
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">Enter Email To Reset Password</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <input 
                        type="text" 
                        id="email"
                        className="emailInput"
                        placeholder="Email"
                        value={email}
                        onChange={onChange}
                    />

                    <Link className='forgotPasswordLink' to='/sign-in'>Sign in</Link>

                    <div className="signInBar">
                        <div className="signInText">Send Reset Link</div>
                        <button className="signInButton">
                            <ArrowRightIcon  fill='#fff' width='34px' height='34px'/>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ForgotPassword
