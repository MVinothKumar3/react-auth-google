import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from './Common';
import GoogleLogin from 'react-google-login';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  const responseGoogle = (response) => {
    console.log(response);
    const googleresponse = {
      name: response.profileObj.name,
      email: response.profileObj.email,
      token: response.googleId,
      Image: response.profileObj.imageUrl,
      ProviderId: 'Google'
    };
    if(googleresponse){
      handleLogin(googleresponse);
    }
    /*axios.post('http://localhost:3300/register',googleresponse).then((result) => {
				if (result.data.success === true) {
          setUserSession(result.data.token, result.data.user);
          props.history.push('/dashboard');
				} else {
          alert(result.data.message);
        }
      });*/
  }

  const handleform = () => {
    if(username.value == '' || password.value == ''){
      alert('All fields required');
    }else{
      const formresponse = {
        email: username.value,
        password: password.value
      };
      handleLogin(formresponse)
    }
  }
  const handleLogin = (somedata) => {
    //if(username.value == '' || password.value == ''){
    //  alert('All field required');
    //}else{
      setError(null);
      setLoading(true);
      axios.post('http://localhost:3300/login',somedata).then(response => {
        setLoading(false);
				if (response.data.success === true) {
          setUserSession(response.data.token, response.data.user, response.data.login);
          props.history.push('/dashboard');
				} else {
          alert(response.data.message);
          this.refs.password.value = '';
        }
      }).catch(error => {
        setLoading(false);
      });
    //}
  }

  return (
    <form>
      Login<br /><br />
      <div>
        Email<br />
        <input type="text" {...username} autoComplete="new-password" required />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" required />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleform} disabled={loading} /><br /><br />
      <GoogleLogin
        clientId="565109783141-g9uqs3kgfl6k4u34ucs7jj8f4uno6met.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </form>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;