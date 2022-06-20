import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import classes from './Welcome.module.css';
import logo from '../img/logo.png';

const Welcome = ({ setLoginData }) => {

  const handleLogin = async (googleData) => {
    const res = await fetch('https://saas-22-18-user-mgmt.herokuapp.com/signin', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.credential,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
      },
    });

    const data = await res.json();
    console.log(data)
    setLoginData(data.token);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "636293118860-afe2ptnfvrgtlpghtnobkq90qespulne.apps.googleusercontent.com",
      callback: handleLogin
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );

    google.accounts.id.prompt();
  }, []);

  return (
    <div className={classes['main-div']}>
      <div className={classes.logoDiv}>
        <img className={classes.logo} alt='energy live logo' src={logo} />
      </div>
      <div id="signInDiv" className={classes['sign-in']}></div>

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
