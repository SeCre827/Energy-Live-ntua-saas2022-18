import React, { useRef } from 'react';
import { useState } from 'react';
import Card from '../UI/Card/Card';
import classes from './ExtendPlan.module.css';
import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const ExtendPlan = ({ token }) => {
  const decodedToken = jwt_decode(token);
  const [enteredEmail, setEnteredEmail] = useState(decodedToken.email);
  const [emailIsValid, setEmailIsValid] = useState();

  const extendByDaysInputRef = useRef();
  const enteredFirstNameInputRef = useRef();
  let enteredFirstName;
  const enteredLastNameInputRef = useRef();
  let enteredLastName;
  const enteredLastLoginInputRef = useRef();
  let enteredLastLogin;

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes('@'));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    enteredFirstName = enteredFirstNameInputRef.current.value;

    console.log('submited');
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
              type='text'
              id='firstName'
              value={enteredFirstName}
              ref={enteredFirstNameInputRef}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor='lastName'>Last Name</label>
            <input
              required
              type='text'
              id='lastName'
              value={enteredLastName}
              ref={enteredLastNameInputRef}
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
              value={enteredEmail}
              onChange={emailChangeHandler}
              onBlur={validateEmailHandler}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor='lastLogin'>Last Login</label>
            <input
              required
              type='text'
              id='lastLogin'
              value={enteredLastLogin}
              ref={enteredLastLoginInputRef}
            />
          </div>
          <div className={classes.containerDiv}>
            <div className={classes.twoItemsFlexDiv}>
              <span>Days left</span>
              <input
                type='text'
                value='5'
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
