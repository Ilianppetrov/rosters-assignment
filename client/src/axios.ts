import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; chartset=utf-8'
    // Authorization:
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlsaWFuQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5ODY4MywiZXhwIjoxNjgxOTkwNjgzfQ.4UGISNYn5kQs9W--k43_hXtm-cLptFXXJ-0ezPScFIA'
  }
})

export default axiosInstance
