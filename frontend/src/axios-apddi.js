import axios from 'axios';

const PRODUCTION = window.location.hostname === 'ab-erp.com';

const instance = axios.create({
    baseURL: PRODUCTION ? 'https://api.ab-erp.com' : 'http://127.0.0.1:3000'
});

export default instance;