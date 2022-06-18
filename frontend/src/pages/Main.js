import React from 'react';
import MainContent from '../components/MainContent';
import SideDrawer from '../components/SideDrawer';
import classes from './Main.module.css';
import axios from 'axios';
import { useQuery } from 'react-query';

const Main = ({token, setLoginData}) => {

  const fetchListener = () => {
    return axios.get(`http://localhost:4005/agpt-latest`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }

  const fetchAGPT = () => {
    return axios.get(`http://localhost:4009/getData/AT/Biomass/20220131/20220202`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }

  const {isLoading, data: latestData, isError, error} = useQuery('front-listener-get', fetchListener, {
    refetchInterval: 100000,
  })
  
  const {isLoading: agptLoading, data: agptData, isError: agptIsError, error: agptError, refetch, isFetching} = useQuery('agpt-get', fetchAGPT, {
    enabled: false,
  })

  console.log("fetch")
  console.log(latestData?.data)

  //console.log(agptData?.data)

  return (
    <div className={classes.mainGrid}>
      <div className={classes.side}>
        <SideDrawer
          token={token}
          agptRefetch={refetch}
          loading={isLoading || isFetching || agptLoading}
          isError={isError}
          error={agptError}
        />
      </div>
      <div className={classes.mainContent}>
        <MainContent token={token} setLoginData={setLoginData} chartData={agptData?.data} latest={latestData?.data}/>
      </div>
    </div>
  );
};

export default Main;
