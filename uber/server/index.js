const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 4001

axios.defaults.baseURL = process.env.GOOGLE_MAPS_API_KEY

app.use(bodyParser.json())
app.use(cors())

app.get('/api/address/:address', async (req, res) => {
    try {
        if (!req.params.address) {
            return res.status(400).json('Address parameter is missing');
        }

        let data = await axios.get(
            'place/autocomplete/json' +
            '?input=' + encodeURIComponent(req.params.address) + // Make sure to encode the address
            '&types=address' +
            '&key=' + process.env.VUE_APP_GOOGLE_MAPS_API_KEY
        );

        res.status(200).json(data.data.predictions);
    } catch (err) {
        console.log(err);
        res.status(500).json('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

