import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from 'react'
import { FaCircle, FaRegCircle } from "react-icons/fa";


function ImageSlider({images}) {

    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const isMounted = setTimeout(() => {
            setCurrent(current === images.length -1 ? 0 : current + 1)
            return () => {isMounted.current = false}
            }, 5000)

        return () => clearTimeout(isMounted)
    })

    return (
        <div className='swiperSlideDiv'>
            {images.map((img, index) => (
                <div 
                    className={index === current ? 'slide active' : 'slide'}
                    key={uuidv4()} 
                >
                   {index === current && (
                        <div 
                            className='swiper-container' 
                            style={{ backgroundImage: `url(${img})`}}>
                        </div>
                   )}
                </div>
            ))}

            <div className='slideDots'>
                <ul>
                    {images.map((img, index) => (
                        <li key={uuidv4()}>
                            {index === current ? 
                            <FaCircle fill='#fff'/> : <FaRegCircle fill='#fff'/>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
       
    )
}

export default ImageSlider
