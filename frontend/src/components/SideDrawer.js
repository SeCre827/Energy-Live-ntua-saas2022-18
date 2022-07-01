import React, { useState } from 'react';
import classes from './SideDrawer.module.css';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import countries from './countries';
import generationTypes from './generationTypes';
import { nowDateFormatter } from './nowFormatter'

const override = css`
  display: block;
  margin: 0 auto;
`;

const SideDrawer = ({ loading, isError, error, setQueryParams }) => {

  const [countryA, setCountryA] = useState('AM');
  const [countryB, setCountryB] = useState('AZ');
  const [dateFrom, setDateFrom] = useState(nowDateFormatter());
  const [generationType, setGenerationType] = useState('Biomass');
  const [quantity, setQuantity] = useState('atl');

  function submitHandler(event) {
    event.preventDefault();
    console.log("submitted");
    console.log(countryA);
    console.log(countryB);
    console.log(dateFrom.replace(/-/g, ""));
    console.log(generationType);
    console.log(quantity);

    setQueryParams({countryA, countryB, dateFrom: dateFrom.replace(/-/g, ""), generationType, quantity})
  }

  return (
    <div className={classes.mainDiv}>
      <h1> EnergyLive 2022</h1>
      <div className={classes.infoDiv}>
        <label htmlFor='start-date'>Starting Date:</label>
        <div className={classes.picker}>
          <input
            className={classes.inputs}
            onChange={(e) => setDateFrom(e.target.value)}
            type='date'
            id='start-date'
            name='start-date'
            max={nowDateFormatter()}
            min='2016-01-01'
            value={dateFrom}
          />
        </div>
        <form onSubmit={submitHandler} className={classes.form1}>
          <div className={classes.options}>
            <div>
              <label htmlFor='quantity'>Quantity:</label>
              <br></br>
              <select
                className={classes.inputs}
                name='quantity'
                id='quantity'
                onChange={(e) => setQuantity(e.target.value)}
              >
                <option key='atl' value='atl'>Actual total Load</option>
                <option key='agpt' value='agpt'>Generation Per Type</option>
                <option key='pf' value='pf'>Cross border flows</option>
              </select>

              <br></br>
              <br></br>
            </div>
              <div>
                <label htmlFor='country'>
                  {`Country${(quantity === 'crossBorderFlows') ? " (from)" : ""}:`}
                </label>
                <br></br>
                <select
                  className={classes.inputs}
                  name='country'
                  id='country'
                  onChange={(e) => setCountryA(e.target.value)}
                  value={countryA}
                >
                  {countries.map((country) => (<option key={country[0]} value={country[0]}>{country[1]}</option>))}
                </select>
                <br></br>
                <br></br>
              </div>
            {quantity === 'agpt' && (
              <div>
                <label htmlFor='agpt'>Generation Type:</label>
                <br></br>
                <select
                  className={classes.inputs}
                  name='generationType'
                  id='generationType'
                  onChange={(e) => setGenerationType(e.target.value)}
                  value={generationType}
                >
                  {generationTypes.map((gt) => (<option key={gt} value={gt}>{gt}</option>))}
                </select>
              </div>
            )}
            {quantity === 'pf' && (
              <div>
              <label htmlFor='countryTo'>Country (to):</label>
              <br></br>
              <select
                className={classes.inputs}
                name='countryTo'
                id='countryTo'
                onChange={(e) => setCountryB(e.target.value)}
                value={countryB}
              >
                {countries.map((country) => (<option key={country[0]} value={country[0]}>{country[1]}</option>))}
              </select>
            </div>
            )}
          </div>
          <div className={classes.submitButton}>
          {loading ? 
            (<ClipLoader color='#34495e' loading={true} css={override} size={150} />) : (
              isError ? 
              (<h2>{error.message}</h2>) : (
                
                  <button onClick={submitHandler}>Refresh</button>
              )
            )
          }
          </div>
        </form>
      </div>
    </div>
  );
};

export default SideDrawer;
