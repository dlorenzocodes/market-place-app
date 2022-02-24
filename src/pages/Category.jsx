import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import { useParams } from 'react-router-dom'
import { db } from '../config/firebase.config'
import ListingItem from '../components/ListingItem'
import { 
    collection, 
    query, 
    where, 
    getDocs,
    limit,
    orderBy,
    startAfter
} from 'firebase/firestore'


function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchListing, setLastFetchListing] = useState(null)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try{
                // Get reference
                const listingRef = collection(db, 'listings')

                // Create query
                const q = query(
                    listingRef, 
                    where('type', '==', params.categoryName), 
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                // Execute the query
                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchListing(lastVisible)

                const listings = []

                querySnap.forEach((listing) => {
                    return listings.push({
                        id: listing.id,
                        data: listing.data()
                    })
                })
                
                setListings(listings)
                setLoading(false)
            }catch(error){
                toast.error('Could not fetch listings!')
            }
        }

        fetchListings()
    }, [params.categoryName])


    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try{
            // Get reference
            const listingRef = collection(db, 'listings')

            // Create query
            const q = query(
                listingRef, 
                where('type', '==', params.categoryName), 
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchListing),
                limit(10)
            )

            // Execute the query
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchListing(lastVisible)

            const listings = []

            querySnap.forEach((listing) => {
                return listings.push({
                    id: listing.id,
                    data: listing.data()
                })
            })
            
            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)

        }catch(error){
            toast.error('Could not fetch listings!')
        }
    }



    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    Places for {params.categoryName === 'rent' ? 'rent' : 'sale'}
                </p>
            </header>

            {loading ? (
                <Spinner /> 
                ): listings && listings.length > 0 ? (
                    <>
                        <main>
                            <ul className="categoryListings">
                                {listings.map((listing) => (
                                    <ListingItem listing={listing} id={listing.id} key={listing.id}/>
                                ))}
                            </ul>
                        </main>

                        <br />
                        <br />

                        {lastFetchListing && (
                            <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
                        )}
                    </>
                ) : (
                    <p>No listings for {params.categoryName}</p>
                )}
        </div>
    )
}

export default Category
