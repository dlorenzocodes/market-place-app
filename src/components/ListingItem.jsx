import { Link } from 'react-router-dom'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'

function ListingItem({listing, id, onDelete, onEdit}) {
    return (
        <>
            <li className="categoryListing">
                <Link to={`/category/${listing.data.type}/${id}`} className="categoryListingLink" >
                    <img 
                        src={listing.data.imgUrls[0]} 
                        alt={listing.data.name}
                        className="categoryListingImg"
                    />

                    <div className="categoryListingDetails">
                        <p className="categoryListingLocation">
                            {listing.data.location}
                        </p>
                        <p className="categoryListingName">
                            {listing.data.name}
                        </p>

                        <p className="categoryListingPrice">
                            ${listing.data.offer ? 
                                listing.data.discountedPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : listing.data.regularPrice 
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            {listing.data.type === 'rent' && '/ Month'}
                        </p>

                        <div className="categoryListingInfoDiv">
                            <img src={bedIcon} alt='bed'/>
                            <p className="categoryListingInfoText">
                                {listing.data.bedrooms > 1 ? 
                                    `${listing.data.bedrooms} Bedrooms` 
                                    : '1 Bedroom'
                                }
                            </p>

                            <img src={bathtubIcon} alt="bath"/>
                            <p className="categoryListingInfoText">
                                {listing.data.bathrooms > 1 ? 
                                    `${listing.data.bathrooms} Bathrooms` 
                                    : '1 Bathroom'
                                }
                            </p>
                        </div>
                    </div>
                </Link>

                {onDelete && (
                    <DeleteIcon 
                        className='removeIcon'
                        fill='rgb(231,76,60)'
                        onClick={() => onDelete(listing.id, listing.data.name)}
                    />
                )}

                {onEdit && (
                    <EditIcon 
                        className='editIcon'
                        fill='rgb(231,76,60)'
                        onClick={() => onEdit(listing.id)}
                    />
                )}
            </li>
        </>
    )
}

export default ListingItem
