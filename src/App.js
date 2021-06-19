import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import ShortUrlApi from './ShorturlApi';
import validator from 'validator';
import logo from './logo.png';
import copyIcon from './copy.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { promiseInProgress } = usePromiseTracker();

  const alertTypes = {
    'success': 'success',
    'error': 'danger',
  };

  const isUrlOptions = {
    protocols: ['http', 'https', 'ftp'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_port: false,
    require_valid_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false,
    validate_length: true
  };

  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isUrlInvalid, setIsUrlInvalid] = useState(false);
  const [response, setResponse] = useState(null);

  const handleOnChange = (event) => {
    event.preventDefault();
    const checkValid = urlValidator(event.target.value);

    setIsUrlValid(checkValid);
    setIsUrlInvalid(!checkValid);
  }

  const urlValidator = (url) => {
    const checkValidUrl = validator.isURL(url, isUrlOptions);
    if (checkValidUrl) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setResponse(null);

    const form = event.currentTarget;
    const url = event.target[0]?.value;
    const isFormValid = form.checkValidity() && urlValidator(url);

    if (!isFormValid) {
      event.stopPropagation();
      setIsUrlInvalid(true);
      setIsUrlValid(false);
    } else {
      if (isFormValid) {
        trackPromise(
          ShortUrlApi.createShorturl(url)
            .then(resp => {
              setResponse({
                message: 'Successfully created Shorturl!',
                link: resp.data.shortUrl,
                type: alertTypes.success,
              });
              setIsUrlInvalid(false);
              setIsUrlValid(false);
            })
            .catch(err => {
              let errMsg;
              if (!err.response) {
                errMsg = 'Failed to connect to server!'
              } else {
                errMsg = 'Unsuccessful! \n' + err.response?.data?.message;
              }
              setResponse({
                message: errMsg,
                type: alertTypes.error,
              });
            })
        );
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Container">
          <h3>Shorturl</h3>
          <img src={logo} className="App-logo" alt="logo" />
          <Form className="user-form" onSubmit={handleSubmit} noValidate>
            <Form.Label>Enter the URL to shorten</Form.Label>
            <Form.Control
              onChange={handleOnChange}
              isValid={isUrlValid}
              isInvalid={isUrlInvalid}
              placeholder="https://example.com"
              required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid URL
            </Form.Control.Feedback>
            {response?.type && <Response response={response} />}
            {promiseInProgress && <div><img src={logo} className="spinner-logo" alt="logo" /></div>}
            <Button className="button-submit" type="submit">Generate Shorturl</Button>
          </Form>
        </div>
      </header>
    </div>
  );
}

const Response = ({ response }) => {
  const { message, type, link } = response;
  const handleOnClick = () => {
    if (link) {
      navigator.clipboard.writeText(link);
    }
  }

  return <Alert className="response" variant={type} onClick={handleOnClick}>
    <div className="response-body">
      <div className="text-container">
        {message}
        {link && <><br />{link}</>}
      </div>
      <div className="copy-icon-container">
        <img className="copy-icon" src={copyIcon} alt="copy" />
      </div>
    </div>
  </Alert>;
}

export default App;
