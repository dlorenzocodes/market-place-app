import {toast} from 'react-toastify'
import { useState, useEffect } from 'react'
import { db } from '../config/firebase.config'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'

function Profile() {
    const auth = getAuth()

    const navigate = useNavigate()

    // edit profile info
    const [changeDetails, setChangeDetails] = useState(false)

    // Gets current user info
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name , email } = formData

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        const fetchUserListings = async() => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, 
                where('userRef', '==', auth.currentUser.uid), 
                orderBy('timestamp', 'desc'))

            const querySnap = await getDocs(q)

            let listings =[]

            querySnap.forEach((listing) => {
                return listings.push({
                    id: listing.id,
                    data: listing.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()

    }, [auth.currentUser.uid])


    const onLogout = () => {
        auth.signOut()
        navigate('/sign-in')
    }

    const onSubmit = async () => {
        try{
            if(auth.currentUser.displayName !== name){
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                 // update in Firestore
                // create a reference of the user
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {name})
                toast.success('Profile was succesfully updated!')
            }
        }catch(error){
            toast.error('Could not update profile details')
        }
    }

    const onDelete = async(listingId) => {
        if(window.confirm('Are you sure you want to delete?')){
            await deleteDoc(doc(db, 'listings', listingId))
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success('Listing was successfully deleted!')
        }
    }


    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)
    

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }
    
    return <div className='profile'>
        <header className="profileHeader">
            <p className='pageHeader'>My Profile</p>
            <button 
                type='button' 
                className="logOut"
                onClick={onLogout}
            >
                Logout
            </button>
        </header>

        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Personal Details</p>
                <p 
                    className="changePersonalDetails" 
                    onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}>
                        {changeDetails ? 'done' : 'change'}
                </p>
            </div>

            <div className="profileCard">
                <form action="">
                    <input 
                        type="text" 
                        id="name"
                        className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                    />

                    <input 
                        type="text" 
                        id="email"
                        className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                    />          
                </form>
            </div>

            <Link to='/create-listing' className='createListing'>
                <img src={homeIcon} alt="home"/>
                <p>Sell or rent your home</p>
                <img src={arrowRight} alt="arrow right"/>
            </Link>

            {!loading && listings?.length > 0 && (
                <>
                    <p className="listingText">Your Listings</p>
                    <ul className="listingList">
                        {listings.map((listing) => (
                            <ListingItem  
                                key={listing.id} 
                                listing={listing} 
                                id={listing.id}
                                onDelete={() => onDelete(listing.id)}
                                onEdit={() => onEdit(listing.id)}
                            />
                        ))}
                    </ul>
                </>
            )}
        </main>
    </div>
}

export default Profile
