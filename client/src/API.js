import axios from 'axios';
import { HEROKU } from './keys.json';
export default axios.create({
    baseURL: HEROKU,
    withCredentials: true,
});
