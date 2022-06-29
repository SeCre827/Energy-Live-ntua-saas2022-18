import { useQuery } from 'react-query';
import axios from 'axios';
import { nowRequestFormatter } from '../components/nowFormatter'

export const useATLData = (onSuccess, onError, token, dateFrom, country) => {

    const fetchATL = () => {
        return axios.get(`${process.env.REACT_APP_ATL}/${country}/${dateFrom}/${nowRequestFormatter()}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
    }

    return useQuery(['atl-get', country, dateFrom], fetchATL, {
        enabled: false,
        onSuccess: onSuccess("atl"),
        onError: onError("atl"),
        select: (data) => data.data.data.map((row) => [row.timestamp, parseFloat(row.value)])
      })
  }