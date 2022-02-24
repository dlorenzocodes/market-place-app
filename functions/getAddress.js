const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config()

exports.handler = async function(event, contex){
    const apiKey = process.env.API_KEY;
    const data = JSON.parse(event.body);
    const location = data.address;
    console.log(location);
    
    const response = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${location}`)
    return {
        statusCode: 200,
        body: JSON.stringify(response.data)
    }  
}
