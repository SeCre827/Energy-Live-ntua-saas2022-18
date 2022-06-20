import { useQuery } from 'react-query';
import axios from 'axios';
import { nowRequestFormatter } from '../components/nowFormatter'

export const usePFData = (onSuccess, onError, token, dateFrom, countryA, countryB) => {

    const fetchPF = () => {
        return axios.get(`https://saas-22-18-pf-data-mgmt.herokuapp.com/getData/${countryA}/${countryB}/${dateFrom}/${nowRequestFormatter()}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
    }

    return useQuery(['pf-get', countryA, dateFrom, countryB], fetchPF, {
        enabled: false,
        onSuccess: onSuccess("pf"),
        onError: onError("pf"),
        select: (data) => data.data.data.map((row) => [row.timestamp, parseFloat(row.value)])
      })
  }