import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || undefined

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
})
