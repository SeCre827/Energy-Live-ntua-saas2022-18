import React, { useRef, useState } from 'react';
import classes from './SideDrawer.module.css';

// να φτιαξω ενα component option που να κανει render δυναμικα τα options me map kai tha tou pernaw ta options me ena array
//  edw mesa na exw ena state poy tha allazei me to refresh kai tha
// allazei to component
const CountriesJsx = (
  <>
    <option value='AM'>Armenia</option>
    <option value='AZ'>Azerbaijan</option>
    <option value='AL'>Albania</option>
    <option value='AT'>Austria</option>
    <option value='BY'>Belarus</option>
    <option value='BE'>Belgium</option>
    <option value='BA'>Bosnia Herzegovina</option>
    <option value='BG'>Bulgaria</option>
    <option value='HR'>Croatia</option>
    <option value='CY'>Cyprus</option>
    <option value='CZ'>Czech Republic</option>
    <option value='DK'>Denmark</option>
    <option value='EE'>Estonia</option>
    <option value='FI'>Finland</option>
    <option value='FR'>France</option>
    <option value='GE'>Georgia</option>
    <option value='DE'>Germany</option>
    <option value='GR'>Greece</option>
    <option value='HU'>Hungary</option>
    <option value='IE'>Ireland</option>
    <option value='IT'>Italy</option>
    <option value='LV'>Latvia</option>
    <option value='LT'>Lithuania</option>
    <option value='LU'>Luxembourg</option>
    <option value='MT'>Malta</option>
    <option value='ME'>Montenegro</option>
    <option value='NL'>Netherlands</option>
    <option value='MK'>North Macedonia </option>
    <option value='NO'>Norway</option>
    <option value='PL'>Poland</option>
    <option value='PT'>Portugal</option>
    <option value='MD'>Republic of Moldova</option>
    <option value='RO'>Romania</option>
    <option value='RS'>Serbia</option>
    <option value='SK'>Slovakia</option>
    <option value='SI'>Slovenia</option>
    <option value='ES'>Spain</option>
    <option value='SE'>Sweden</option>
    <option value='CH'>Switzerland</option>
    <option value='TR'>Turkey</option>
    <option value='UA'>Ukraine</option>
    <option value='UK'>United Kingdom</option>
    <option value='RU'>Russia</option>
    <option value='RU'>Russia</option>
    <option value='XK'>Kosovo</option>
  </>
);

const SideDrawer = () => {
  const countryInputRef = useRef();
  const startDateInputRef = useRef();
  const quantityInputRef = useRef();
  const generationTypeInputRef = useRef();
  const countryToInputRef = useRef();
  const countryFromInputRef = useRef();

  const [mainPage, setMainPage] = useState('actualTotalLoad');

  function submitHandler(event) {
    event.preventDefault();
    console.log('constructor running');

    const enteredQuantity = quantityInputRef.current.value;
    const enteredCountry = countryInputRef.current.value;
    const startDate = startDateInputRef.current.value;

    console.log(enteredCountry);
    console.log(enteredQuantity);
    console.log(startDate);
  }

  const changeHandler = (event) => {
    const newMainPage = quantityInputRef.current.value;
    setMainPage(newMainPage);
  };

  return (
    <div className={classes.mainDiv}>
      <h1> EnergyLive 2022</h1>
      <div className={classes.infoDiv}>
        <label htmlFor='start-date'>Starting Date:</label>
        <div className={classes.picker}>
          <input
            className={classes.inputs}
            ref={startDateInputRef}
            type='date'
            id='start-date'
            name='start-date'
            // value='2022-03-01'
            max='2022-03-31'
            min='2022-01-01'
          />
        </div>
        <form onSubmit={submitHandler} className={classes.form1}>
          <div className={classes.options}>
            {/* 1nd option */}
            <div>
              <label htmlFor='quantity'>Quantity:</label>
              <br></br>
              <select
                className={classes.inputs}
                name='quantity'
                id='quantity'
                ref={quantityInputRef}
                onChange={changeHandler}
              >
                <option value='actualTotalLoad'>Actual total Load</option>
                <option value='generationPerType'>Generation Per Type</option>
                <option value='crossBorderFlows'>Cross border flows</option>
              </select>

              <br></br>
              <br></br>
            </div>
            {/* 2nd option */}
            {(mainPage === 'actualTotalLoad' ||
              mainPage === 'generationPerType') && (
              <div>
                <label htmlFor='country'>Country:</label>
                <br></br>
                <select
                  className={classes.inputs}
                  name='country'
                  id='country'
                  ref={countryInputRef}
                >
                  {CountriesJsx}
                </select>
              </div>
            )}
            {mainPage === 'crossBorderFlows' && (
              <div>
                <label htmlFor='countryFrom'>Country (from):</label>
                <br></br>
                <select
                  className={classes.inputs}
                  name='countryFrom'
                  id='countryFrom'
                  ref={countryFromInputRef}
                >
                  {CountriesJsx}
                </select>
              </div>
            )}
            {/* end of second option  */}
            {/* start of 3 option */}
            {mainPage === 'generationPerType' && (
              <div>
                <label htmlFor='generationType'>Generation Type:</label>
                <br></br>
                <select
                  className={classes.inputs}
                  name='generationType'
                  id='generationType'
                  ref={generationTypeInputRef}
                >
                  <option value='naturalGas'>Biomass</option>
                  <option value='naturalGas'>Fossil Gas</option>
                  <option value='naturalGas'>Fossil Brown coal/Lignite</option>
                  <option value='naturalGas'>Fossil Hard coal</option>
                  <option value='naturalGas'>Fossil Oil</option>
                  <option value='naturalGas'>Fossil Coal-derived gas</option>
                  <option value='naturalGas'>Fossil Peat</option>
                  <option value='naturalGas'>Fossil Oil shale</option>
                  <option value='naturalGas'>Hydro</option>
                  <option value='naturalGas'>Nuclear</option>
                  <option value='naturalGas'>Solar</option>
                  <option value='naturalGas'>Waste</option>
                  <option value='naturalGas'>Wind Onshore</option>
                  <option value='naturalGas'>Run-of-river and poundage</option>
                  <option value='naturalGas'>Hydro Water Reservoir</option>
                  <option value='naturalGas'>Other</option>
                  <option value='naturalGas'>Geothermal</option>
                  <option value='naturalGas'>Other renewable</option>
                  <option value='naturalGas'>Wind Offshore</option>
                  <option value='naturalGas'>Hydro Pumped Storage</option>
                  <option value='naturalGas'>Marine</option>
                </select>
              </div>
            )}
            {mainPage === 'crossBorderFlows' && (
              <div>
                <label htmlFor='countryTo'>Country (to):</label>
                <br></br>
                <select
                  className={classes.inputs}
                  name='countryTo'
                  id='countryTo'
                  ref={countryToInputRef}
                >
                  {CountriesJsx}
                </select>
              </div>
            )}
            {/* end  of 3rd option */}
          </div>
          <div className={classes.submitButton}>
            <button>Refresh</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SideDrawer;
