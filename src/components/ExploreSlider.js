import Spinner from './Spinner'
import { useState, useEffect } from 'react'
import { db } from '../config/firebase.config'
import { useNavigate } from 'react-router-dom'
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'




function ExploreSlider() {

    const [current, setCurrent] = useState(0)
    const [listings, setlistings] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
   

    useEffect(() => {
        const isMounted = setTimeout(() => {
            setCurrent(current === listings.length -1 ? 0 : current + 1)
            return () => {isMounted.current = false}
            }, 5000)

        return () => clearTimeout(isMounted)
    })


    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
    
            const querySnap = await getDocs(q)
    
            let listings = []
    
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setlistings(listings)
            setLoading(false)
        }
    
        fetchListings()
    }, [])

    if(loading){
        return <Spinner />
    }

    if(listings.length === 0){
        return <></>
    }

    return (
        listings && (
            <>
                <p className='exploreHeading'>Recommended</p>

                <div className='swiperSlideDiv'>
                    {listings.map((listing, index) => (
                        <div 
                            className={index === current ? 'slide active' : 'slide'}
                            style={{cursor: 'pointer'}}
                            key={listing.id}
                            onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}
                        >
                           {index === current && (
                                <div>
                                    <div 
                                        className='swiper-container' 
                                        style={{ backgroundImage: `url(${listing.data.imgUrls[0]})`}}>
                                    </div>

                                    <p className='swiperSlideText'>{listing.data.name}</p>
                                    <p className='swiperSlidePrice'>
                                        ${listing.data.discountedPrice ?? listing.data.regularPrice}{' '}{listing.data.type === 'rent' && '/ month'}
                                    </p>
                                </div>
                           )}
                        </div>
                    ))}

                    <div className='slideDots'>
                        <ul>
                            {listings.map((listing, index) => (
                                <li key={listing.id}>
                                    {index === current ? 
                                    <FaCircle fill='#fff'/> : <FaRegCircle fill='#fff'/>}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </>
        )
    )
}

export default ExploreSlider
