import React, { useState } from 'react';
import classes from './SideDrawer.module.css';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import countries from './countries';
import generationTypes from './generationTypes';

const override = css`
  display: block;
  margin: 0 auto;
`;

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

const SideDrawer = ({ agptRefetch, loading, isError, error }) => {

  const now = new Date();
  const nowFormatted = `${now.getFullYear()}-${months[now.getMonth()]}-${now.getDate()}`;

  const [countryA, setCountryA] = useState('AM');
  const [countryB, setCountryB] = useState('AZ');
  const [date, setDate] = useState(nowFormatted);
  const [generationType, setGenerationType] = useState('Biomass');
  const [quantity, setQuantity] = useState('actualTotalLoad');

  function submitHandler(event) {
    event.preventDefault();
    console.log("submitted");
    console.log(countryA);
    console.log(countryB);
    console.log(date.replace(/-/g, ""));
    console.log(generationType);
    console.log(quantity);
  }

  return (
    <div className={classes.mainDiv}>
      <h1> EnergyLive 2022</h1>
      <div className={classes.infoDiv}>
        <label htmlFor='start-date'>Starting Date:</label>
        <div className={classes.picker}>
          <input
            className={classes.inputs}
            onChange={(e) => setDate(e.target.value)}
            type='date'
            id='start-date'
            name='start-date'
            max={nowFormatted}
            min='2016-01-01'
            value={date}
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
                <option key='actualTotalLoad' value='actualTotalLoad'>Actual total Load</option>
                <option key='generationPerType' value='generationPerType'>Generation Per Type</option>
                <option key='crossBorderFlows' value='crossBorderFlows'>Cross border flows</option>
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
            {quantity === 'generationPerType' && (
              <div>
                <label htmlFor='generationType'>Generation Type:</label>
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
            {quantity === 'crossBorderFlows' && (
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
                
                  <button onClick={agptRefetch}>Refresh</button>
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
