import axios from 'axios'

const api = axios.create({
    baseURL:'https://gelinhos-backend.herokuapp.com/'
})

export default api