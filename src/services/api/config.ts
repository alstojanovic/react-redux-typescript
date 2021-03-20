import axios, { AxiosRequestConfig } from 'axios';

const apiConfig: AxiosRequestConfig = {
    baseURL: `${process.env.REACT_APP_API_BASE_URL}/${process.env.REACT_APP_API_VERSION}/`,
    timeout: 3000,
};
const Api = axios.create(apiConfig);

export default Api;
