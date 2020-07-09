// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  const login = sessionStorage.getItem('login');
  const myObj = {
    "userStr":userStr,
    "login":login
  };
  //if(login) console.log(login);
  if (userStr) return myObj;
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('login');
}

// set the token and user from the session storage
export const setUserSession = (token, user, login) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('login', login);
}