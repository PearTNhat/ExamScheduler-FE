import axios from 'axios'
export const http = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json'
    }
})