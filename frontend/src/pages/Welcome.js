import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Welcome.module.css';
import logo from '../img/logo.png';
import GoogleLogin from 'react-google-login';
import { useLocation, useNavigate } from "react-router-dom";
// prof
const Welcome = ({ setLoginData }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleFailure = (result) => {
    alert(result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch('http://localhost:5000/signin', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
      },
    });

    const data = await res.json();
    console.log(data)
    setLoginData(data.token);
    if (location.pathname === '/welcome')
      navigate('/');
  };

  return (
    <div className={classes['main-div']}>
      <div className={classes.logoDiv}>
        <img className={classes.logo} alt='energy live logo' src={logo} />
      </div>
      <div className={classes.login}>
        {/*Sign in with google  */}

        <>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
          ></GoogleLogin>
        </>
      </div>

      <div className={classes.footer}>
        <ul className={classes.footerList}>
          <li>
            <Link to='/about'> About </Link>
          </li>
          <li>
            <Link to='/plans'> Plans </Link>
          </li>
          <li>
            {/* <Link to='/legal'> Legal </Link> */}
            <a target="_blank" rel='noopener noreferrer' href="https://www.entsoe.eu/about/legal-and-regulatory/">Legal</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Welcome;
