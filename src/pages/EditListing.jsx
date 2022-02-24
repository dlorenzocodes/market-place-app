import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { db } from '../config/firebase.config'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function EditListing() {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name:'',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    })

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
    } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()
    const isMounted = useRef(true)
    

    useEffect(() => {
        setLoading(true)

        const fetchListing = async() => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                setListing(docSnap.data())
                setFormData({...docSnap.data(), address: docSnap.data().location})
                setLoading(false)
            } else{
                navigate('/')
                toast.error('Listing does not exist!')
            }
        }

        fetchListing()
    }, [navigate, params.listingId])




    // Gets user ID and adds to form Data
    useEffect(() => {
        if(isMounted){
            // gets the currently signed in user
            onAuthStateChanged(auth, (user) => {
                if(user){
                    setFormData({...formData, userRef: user.uid})
                } else{
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])


    // Validate that listing belongs to user
    useEffect(() => {
        if(listing && listing.userRef !== auth.currentUser.uid){
            toast.error('Not enough permission to edit this listing!')
            navigate('/')
        }
    })


    if(loading) return <Spinner />


    const postAddress = async () => {
        const response = await fetch('/.netlify/functions/getAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({address: address})
        })

        const data = response.json()
        return data
    }   



    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        if(discountedPrice >= regularPrice){
            setLoading(false)
            toast.error('Discounted pice needs to be less than regular price')
            return
        }

        if(images.length > 6){
            setLoading(false)
            toast.error('Max 6 images')
            return
        }

        const data = await postAddress()

        let gelocation = {}
        let location

        if(data.length !== 0){
            gelocation.lat = data.data[0]?.latitude ?? 0
            gelocation.lng = data.data[0].longitude ?? 0
            location = address
        
        } else{
            setLoading(false)
            toast.error('Please enter a correct address or verify address format')
            return
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error(
                'Some images were not uploaded. Please make sure your images are 2MB or less!'
            )
            return
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            gelocation,
            timestamp: serverTimestamp(), 
        }

        delete formDataCopy.images
        delete formDataCopy.address
        formDataCopy.location = location
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = doc(db, 'listings', params.listingId)
        await updateDoc(docRef, formDataCopy)
        setLoading(false)
        toast.success('Listing saved!')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }



    // -------------------------------

    const onMutate = (e) => {
        let boolean = null

        if(e.target.value === 'true'){
            boolean = true
        }

        if(e.target.value === 'false'){
            boolean = false
        }

        // Files
        if(e.target.files){
            // get the other info and added with the new images
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        //Text/Number/Booleans
        if(!e.target.files){
            setFormData((prevState) => ({
                ...prevState,

                // Nullish Coalescing Operator - returns right side if left is null
                // otherwise returns left side
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }


    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage()
            const imageName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

            const storageRef = ref(storage, 'images/' + imageName)
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                }, 
                (error) => {
                    reject(error)
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );

        })
    }

    // -----------------------
    return (
        <div className='profile'>
            <header>
                <p className="pageHeader">Edit your Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className="formButtons">
                        <button 
                            type='button' 
                            className={type === 'sale' ? 
                            'formButtonActive' : 'formButton'}
                            id='type'
                            value='sale'
                            onClick={onMutate}
                        >
                            Sell
                        </button>

                        <button 
                            type='button' 
                            className={type === 'rent' ? 
                            'formButtonActive' : 'formButton'}
                            id='type'
                            value='rent'
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input 
                        className='formInputName'
                        type="text"
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Bedrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Bathrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                    </div>

                    <label className='formLabel'>Parking spot</label>
                    <div className='formButtons'>
                        <button 
                            className={parking ? 
                            'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={true}
                            onClick={onMutate}
                            min='1'
                            max='50'
                        >
                            Yes
                        </button>
                        <button 
                            className={!parking && parking !== null ? 
                            'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className='formButtons'>
                        <button 
                            className={furnished ? 
                            'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button 
                            className={!furnished && furnished !== null ? 
                            'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea 
                        className='formInputAddress'
                        type='text'
                        id='address'
                        placeholder='4488 Pratt Ave Portland, WA 97205'
                        value={address}
                        onChange={onMutate}
                        required
                    />

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button 
                            className={offer ? 
                            'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button 
                            className={!offer && offer !== null ? 
                            'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>
                    
                    <label className='formLabel'>Regular Price</label>
                    <div className="formPriceDiv">
                        <input 
                            className='formInputSmall' 
                            type="number"
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />

                        {formData.type === 'rent' && (
                            <p className='formPriceText'>$ / Month</p>
                        )}
                    </div>

                    {offer && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                                <input 
                                    className='formInputSmall' 
                                    type="number"
                                    id='discountedPrice'
                                    value={discountedPrice}
                                    onChange={onMutate}
                                    min='50'
                                    max='750000000'
                                    required={offer}
                                />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                        <p className="imagesInfo">The first image will be the cover (max 6).</p>
                        <input 
                            className="formInputFile"
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max='6'
                            accept='.jpg,.png,.jpeg'
                            multiple
                            required
                        />
                    
                    <button 
                        className='primaryButton 
                        createListingButton' 
                        type='submit'
                    >
                             Edit Lsiting
                    </button>
                </form>
            </main>
        </div>
    )
}

export default EditListing
