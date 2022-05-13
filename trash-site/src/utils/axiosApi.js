//apis.js
import axios from 'axios'

const api =(url) => axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api