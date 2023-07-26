import axios from 'axios';

const ApiRequest = axios.create({
  baseURL: '/'
})

export default ApiRequest;