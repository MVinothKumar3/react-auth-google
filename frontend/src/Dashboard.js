import React from 'react';
import { getUser, removeUserSession } from './Common';
import { GoogleLogout } from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { useGoogleLogout } from 'react-google-login';

function Dashboard(props) {
  const user = getUser();
  //console.log(user);
  // handle click event of logout button
  const handleLogout = () => {

    removeUserSession();
    props.history.push('/login');
  }
  
  return (
    <div>
      Welcome {user.userStr}!<br /><br />
      {user.login=="google" ?
      <GoogleLogout
          clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
          render={renderProps => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</button>
          )}
          buttonText='Logout'
          onLogoutSuccess={ handleLogout }
        >
        </GoogleLogout>
      :
      <input type="submit" value="logout" onClick={ handleLogout }/>
      }
     

    </div>
  );
}

export default Dashboard;