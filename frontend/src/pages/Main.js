import React from 'react';
import MainContent from '../components/MainContent';
import SideDrawer from '../components/SideDrawer';
import classes from './Main.module.css';
import { useFetchListener } from '../hooks/useFetchListener';
import { useAGPTData } from '../hooks/useAGPTData';
import { useATLData } from '../hooks/useATLData';
import { usePFData } from '../hooks/usePFData';
import { useState, useRef, useEffect } from 'react';
import { nowRequestFormatter } from '../components/nowFormatter';
import countries from '../components/countries';

const onSuccess = (query) => (data) => {
  switch (query) {
    case "agpt":
      console.log("AGPT fetched", data);
      break;
    case "atl":
      console.log("ATL fetched", data);
      break;
    case "pf":
      console.log("PF fetched", data);
      break;
    case "listener":
      console.log("Listener fetched", data);
      break
    default:
      console.log("some success")
  }
}

const onError = (query) => (error) => {
  switch (query) {
    case "agpt":
      console.log("AGPT error", error);
      break;
    case "atl":
      console.log("ATL error", error);
      break;
    case "pf":
      console.log("PF error", error);
      break;
    case "listener":
      console.log("Listener error", error);
      break
    default:
      console.log("some error")
  }
}

const Main = ({token, setLoginData}) => {

  const [ queryParams, setQueryParams ] = useState({
    countryA: "AM",
    countryB: "AZ",
    dateFrom: nowRequestFormatter(),
    generationType: "Biomass",
    quantity: "atl"
  })

  const [ latestUpdate, setLatestUpdate ] = useState(null);

  const listenerRes = useFetchListener(onSuccess, onError, token, queryParams.quantity);
  
  const atlRes = useATLData(onSuccess, onError, token, queryParams.dateFrom, queryParams.countryA);

  const agptRes = useAGPTData(onSuccess, onError, token, queryParams.dateFrom, queryParams.countryA, queryParams.generationType);

  const pfRes = usePFData(onSuccess, onError, token, queryParams.dateFrom, queryParams.countryA, queryParams.countryB);

  const firstUpdate = useRef(true);

  useEffect(() => {
    if(listenerRes.data && latestUpdate && listenerRes.data !== latestUpdate) {
      switch(queryParams.quantity) {
        case "pf":
          pfRes.refetch();
          break;
        case "agpt":
          agptRes.refetch();
          break;
        default:
          atlRes.refetch();
      }
    }
    setLatestUpdate(listenerRes.data)
  })

  useEffect(() => {
    if (firstUpdate.current) {
      console.log("First render");
      firstUpdate.current = false;
      return;
    }

    else { 
      console.log("Second Render");
      console.log(firstUpdate);
      listenerRes.refetch();
      switch(queryParams.quantity) {
        case "pf":
          pfRes.refetch();
          break;
        case "agpt":
          agptRes.refetch();
          break;
        default:
          atlRes.refetch();
      }
    };
  }, [queryParams]);

  const chartDescription = () => {
    let countryA = countries.find(el => el[0]===queryParams.countryA)
    let countryB = countries.find(el => el[0]===queryParams.countryB)
    switch(queryParams.quantity) {
      case "pf":
        return ["Crossborder Flows", countryA[1], countryB[1]];
      case "agpt":
        return ["Generation Per Type", queryParams.generationType, countryA[1]];
      default:
        return ["Actual Total Load", "", countryA[1]];
    }
  }

  return (
    <div className={classes.mainGrid}>
      <div className={classes.side}>
        <SideDrawer
          loading={listenerRes.isLoading || atlRes.isLoading || agptRes.isLoading || pfRes.isLoading}
          isError={listenerRes.IsError || atlRes.isError || agptRes.IsError || pfRes.isError}
          error={listenerRes.Error || atlRes.Error || agptRes.Error || pfRes.error}
          setQueryParams={setQueryParams}
        />
      </div>
      <div className={classes.mainContent}>
        <MainContent
          token={token}
          setLoginData={setLoginData}
          chartData={
            queryParams.quantity === "pf" ?
              pfRes.data : (
                queryParams.quantity === "agpt" ? 
                  agptRes.data :
                  atlRes.data
          )} 
          latest={listenerRes.data}
          description={chartDescription()}/>
      </div>
    </div>
  );
};

export default Main;
