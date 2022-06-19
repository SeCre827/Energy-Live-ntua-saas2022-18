import { useQuery } from 'react-query';
import axios from 'axios';
import { nowRequestFormatter } from '../components/nowFormatter'

export const usePFData = (onSuccess, onError, token, dateFrom, countryA, countryB) => {

    const fetchPF = () => {
        return axios.get(`http://localhost:8080/getData/${countryA}/${countryB}/${dateFrom}/${nowRequestFormatter()}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
    }

    return useQuery(['pf-get', countryA, dateFrom, countryB], fetchPF, {
        enabled: false,
        onSuccess: onSuccess("pf"),
        onError: onError("pf"),
        select: (data) => data.data.entries.map((row) => [row.timestamp, parseFloat(row.value)])
      })
  }