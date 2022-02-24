import { getAuth } from 'firebase/auth'
import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import { db } from '../config/firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { useParams, Link} from 'react-router-dom'
import shareIcon from '../assets/svg/shareIcon.svg'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import ImageSlider from '../components/ImageSlider'


function Listing() {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false)

    const auth = getAuth()
    const params = useParams()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.id)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                setListing(docSnap.data())
                setLoading(false)
            }

        }
        
        fetchListing()
    }, [params.id])

    

    const copyToClipboard = async () => {
        navigator.clipboard.writeText(window.location.href)
        setSharedLinkCopied(true)
        setTimeout(() => {
            setSharedLinkCopied(false)
        }, 2000)
    }

    if(loading){
        return <Spinner />
    } else{

        return <main>
                
                {listing.imgUrls.length === 0 ? <></> : <ImageSlider images={listing.imgUrls} />}
               
                <div className="shareIconDiv" onClick={copyToClipboard}>
                    <img src={shareIcon} alt=""/>
                </div>
    
                {sharedLinkCopied && <p className='linkCopied'>Link Copied!</p>}
    
                <div className="listingDetails">
                    <p className="listingName">
                        {listing.name} - $
                        {listing.offer ? 
                            listing.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                            : listing.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                    </p>
                    <p className="listingLocation">{listing.location}</p>
                    <p className="listingType"> For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                    {listing.offer && (
                        <p className='discountPrice'>${listing.regularPrice - listing.discountedPrice} discount price</p>
                    )}

                    <ul className="listingDetailsList">
                        <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms`: '1 Bedroom'}</li>
                        <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
                        <li>{listing.parking && 'Parking Available'}</li>
                        <li>{listing.furnished && 'Furnished'}</li>
                    </ul>

                    <p className="listingLocationTitle">Location</p>

                    <div className="leafletContainer">
                        <MapContainer 
                            style={{height: '100%', width: '100%'}}
                            center={[listing.gelocation.lat, listing.gelocation.lng]}
                            zoom={13}
                            scrollWheelZoom={false}
                        >
                            <TileLayer 
                                attribution='&copy; <a> href="http://osm.org/
                                copyright">OpenStreetMap</a> contributors'
                                url='https://{s}.tile.openstreetmap.de/tiles/osmde/
                                {z}/{x}/{y}.png'
                            />

                            <Marker 
                                position={[listing.gelocation.lat, 
                                listing.gelocation.lng]}>
                                    <Popup>{listing.location}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {auth.currentUser.uid !== listing.userRef && (
                        <Link 
                            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                            className='primaryButton'
                        >
                            Contact Lanlord
                        </Link>
                    )}
                </div>
            </main>
    }

    
}

export default Listing
