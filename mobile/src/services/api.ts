import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://192.168.6.103:3333'
})