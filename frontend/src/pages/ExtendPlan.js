import React, { useRef } from 'react';
import { useState } from 'react';
import Card from '../UI/Card/Card';
import classes from './ExtendPlan.module.css';
import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ExtendPlan = ({ token, setLoginData }) => {
  const navigate = useNavigate();
  const decodedToken = jwt_decode(token);

  const [Email, setEmail] = useState(decodedToken.email);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [FirstName, setFirstName] = useState(decodedToken.first_name);
  const [LastName, setLastName] = useState(
    decodedToken.last_name || 'Not provided'
  );
  const [lastLogin, setLastLogin] = useState(
    DateTime.fromISO(decodedToken.last_login).toLocaleString(
      DateTime.DATETIME_MED
    )
  );

  let daysLeft = decodedToken.licence_expiration ? DateTime.fromISO(decodedToken.licence_expiration)
    .diffNow(['days', 'hours', 'minutes'])
    .toObject() : {days: 0, hours: 0, minutes: 0}

  let daysLeftOutput = `${daysLeft.days} days ${
    daysLeft.hours
  } hours & ${Math.trunc(daysLeft.minutes)} mins`;
  const extendByDaysInputRef = useRef();

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const validateEmailHandler = () => {
    setEmailIsValid(Email.includes('@'));
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    let urlencoded = new URLSearchParams();
    urlencoded.append('extendBy', extendByDaysInputRef.current.value);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    };

    fetch('https://saas-22-18-user-mgmt.herokuapp.com/extend-licence', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // update token in local storage
        setLoginData(JSON.parse(result).token);
        // localStorage.setItem('token', JSON.parse(result).token);
        // redirect
        navigate('/');
        console.log(JSON.parse(result).token);
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <div className={classes.mainDiv}>
      <h1>Energy Live 2022 </h1>
      <Card className={classes.login}>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='firstName'>First Name</label>
            <input
              required
              readOnly
              type='text'
              id='firstName'
              value={FirstName}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor='lastName'>Last Name</label>
            <input
              required
              readOnly
              type='text'
              id='lastName'
              value={LastName}
            />
          </div>
          <div
            className={`${classes.control} ${
              emailIsValid === false ? classes.invalid : ''
            }`}
          >
            <label htmlFor='email'>E-Mail</label>
            <input
              type='email'
              id='email'
              readOnly
              value={Email}
              onChange={emailChangeHandler}
              onMouseLeave={validateEmailHandler}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor='lastLogin'>Last Login</label>
            <input
              required
              readOnly
              type='text'
              id='lastLogin'
              value={lastLogin}
            />
          </div>
          <div className={classes.containerDiv}>
            <div className={classes.twoItemsFlexDiv}>
              <span>Days left</span>
              <input
                type='text'
                value={daysLeftOutput}
                readOnly
                className={classes.daysLeft}
              />
            </div>
            <div className={classes.twoItemsFlexDiv}>
              <label htmlFor='extendByDays'>Extend By (Days):</label>
              <select
                name='extendByDays'
                id='extendByDays'
                ref={extendByDaysInputRef}
              >
                <option value='10'>10</option>
                <option value='20'>20</option>
                <option value='30'>30</option>
              </select>
            </div>
          </div>

          <div className={`${classes.actions}  ${classes.buttonsDiv}`}>
            <Button
              type='submit'
              className={classes.btn}
              disabled={!emailIsValid}
            >
              Extend
            </Button>
            <Button
              type='submit'
              className={classes.btnGrey}
              disabled={!emailIsValid}
            >
              Cancel
            </Button>
          </div>
          <div className={classes.cancelDiv}>
            <Link to='/' className={classes.cancelBtn}>
              Back
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default ExtendPlan;
