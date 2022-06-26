import { useQuery } from 'react-query';
import axios from 'axios';

export const useFetchListener = (onSuccess, onError, token, dataset) => {

    const fetchListener = () => {
        return axios.get(`https://saas-22-18-frontend-listener.herokuapp.com/${dataset}-latest`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      }

    return useQuery('front-listener-get', fetchListener, {
        refetchInterval: 100000,
        onSuccess: onSuccess("listener"),
        onError: onError("listener"),
        select: (data) => data.data.latest_timestamp
      })
  }