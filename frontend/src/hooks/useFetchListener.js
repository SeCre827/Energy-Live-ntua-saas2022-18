import { useQuery } from 'react-query';
import axios from 'axios';

export const useFetchListener = (onSuccess, onError, token, dataset) => {

    const fetchListener = () => {
        return axios.get(`${process.env.REACT_APP_LISTENER}/${dataset}-latest`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      }

    return useQuery('front-listener-get', fetchListener, {
        refetchInterval: 3000,
        onSuccess: onSuccess("listener"),
        onError: onError("listener"),
        select: (data) => data.data.latest_timestamp
      })
  }