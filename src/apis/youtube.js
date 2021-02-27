import axios from 'axios';
// const KEY = 'AIzaSyAFUNYmE1gfydRFrlb3Q05gXlPSgQmiY6I';
// const KEY = 'AIzaSyBHuIDHXveNrplnewoqJVytwHFi8LQQOlk';
const KEY = 'AIzaSyANxnq6KB-lvhbgTTwcH7PShU7Fx2sirP0';

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
        part: 'snippet',
        maxResults: 5,
        key: KEY
    }
})
