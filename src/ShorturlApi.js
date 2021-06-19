import axios from 'axios';

const api_url = "http://shorturlservice-env.eba-umwheeti.ap-southeast-1.elasticbeanstalk.com";

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