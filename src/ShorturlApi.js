import axios from 'axios';

const api_url = "https://powerful-bayou-39266.herokuapp.com";

const methods = {
    create: "/create",
};

const ShorturlApi = {
    createShorturl: (url) => {
        const reqBody = {
            'url': url,
        };
        return axios.post(
            api_url + methods.create, reqBody, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}

export default ShorturlApi;