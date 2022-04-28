import React from 'react';
import MainContent from '../components/MainContent';
import SideDrawer from '../components/SideDrawer';
import classes from './Main.module.css';

const Main = ({token, setLoginData}) => {
  return (
    <div className={classes.mainGrid}>
      <div className={classes.side}>
        <SideDrawer />
      </div>
      <div className={classes.mainContent}>
        <MainContent token={token} setLoginData={setLoginData}/>
      </div>
    </div>
  );
};

export default Main;
