import React from 'react';
import { Link } from 'react-router-dom';
import Chart from './Chart';
import classes from './MainContent.module.css';
import jwt_decode from 'jwt-decode';
import { DateTime } from 'luxon';

const MainContent = ({ token, setLoginData, chartData, latest, description }) => {
  const decodedToken = jwt_decode(token);

  let daysLeft = DateTime.fromISO(decodedToken.licence_expiration)
    .diffNow('days')
    .toObject();

  const doLogout = async () => {
    try {
      const res = await fetch(`http://localhost:5000/signout`, {
        method: 'post',
        mode: 'cors',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      const status = await res.status;

      if (status === 200) {
        setLoginData(undefined);
        console.log('remove from storage');
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.log(e);
    }
  };

  let chart;
  const refHandler = (ref) => {
    chart = ref;
  };

  const downloadCSV = () => {
    if (chart && chart.current && chart.current.chart) {
      chart.current.chart.downloadCSV();
    }
    // error handling
    else console.log('You have to Chart');
  };

  const downloadImage = () => {
    if (chart && chart.current && chart.current.chart) {
      chart.current.chart.exportChart();
    }
    // error handling
    else console.log('You have to Chart');
  };

  return (
    <div className={classes.mainDiv}>
      <div className={classes.info}>
        <span> {decodedToken.email}</span>
        <Link to='/welcome' onClick={doLogout}>
          {' '}
          Sign out{' '}
        </Link>
      </div>
      <div className={classes.infoDiv}>
        <div className={classes.loadAndCountry}>
          <span>{description[0]}</span>
          <span>{description[1]}</span>
          <span>{description[2]}</span>
        </div>
        <div className={classes.chart}>
          <Chart giveRef={refHandler} chartData={chartData}/>
        </div>
        <h2 className={classes.lastUpdate}> { `Latest update: ${latest ? new Date(latest.latest_timestamp) : ""}`}</h2>
        <div className={classes.helperDiv}>
          <div className={classes.chartButtons}>
            <button onClick={downloadImage}> Download Image</button>
            <button onClick={downloadCSV}> Download Data</button>
          </div>
          <div className={classes.finalInfo}>
            <span>Service Status: #Live</span>
            <span>Days Left: {Math.ceil(daysLeft.days)}</span>
            <Link to='/extend-plan'>Extend Plan</Link>
            <Link to='/about'>About</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
